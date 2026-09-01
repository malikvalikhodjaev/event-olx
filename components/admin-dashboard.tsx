"use client";

import { useMemo, useState } from "react";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { calculateAdminAnalytics, type DashboardPeriod } from "@/lib/admin-analytics";
import { getServiceById, getSupplierById, services, suppliers } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";
import { setSupplierBanned, updateModeration } from "@/lib/demo-store";
import type { ModerationStatus } from "@/lib/types";

const moderationLabels: Record<ModerationStatus, string> = {
  pending: "Ожидает",
  approved: "Одобрена",
  changes_requested: "Нужны правки",
  hidden: "Скрыта",
};

const actionLabels: Record<string, string> = {
  approved: "Карточка одобрена",
  changes_requested: "Карточка возвращена на исправление",
  hidden: "Карточка скрыта",
  supplier_banned: "Поставщик заблокирован",
  supplier_unbanned: "Поставщик разблокирован",
};

const periodOptions: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "90d", label: "90 дней" },
  { value: "all", label: "Всё время" },
];

function comparisonText(current: number, previous: number | null) {
  if (previous === null) return "за весь доступный период";
  const difference = current - previous;
  if (difference > 0) return `+${difference} к предыдущему периоду`;
  if (difference < 0) return `${difference} к предыдущему периоду`;
  return "без изменения к предыдущему периоду";
}

function responseTime(minutes: number | null) {
  if (minutes === null) return "—";
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} ч ${remainder} мин` : `${hours} ч`;
}

function supplierRegistrationNote(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;
  const verb = last === 1 && lastTwo !== 11
    ? "зарегистрирован"
    : last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)
      ? "зарегистрированы"
      : "зарегистрировано";
  return `+${count} ${verb} за период`;
}

function MetricCard({
  label,
  value,
  note,
  accent = "neutral",
}: {
  label: string;
  value: string | number;
  note: string;
  accent?: "neutral" | "yellow" | "green";
}) {
  return (
    <article className={`admin-metric-card admin-metric-${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

export function AdminDashboard() {
  const { state, refresh } = useDemoSession();
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [period, setPeriod] = useState<DashboardPeriod>("30d");
  const [now, setNow] = useState(() => new Date());
  const analytics = useMemo(
    () => calculateAdminAnalytics({
      period,
      now,
      suppliers,
      services: [...services, ...state.importedServices],
      conversations: state.conversations,
      moderation: state.moderation,
      bannedSupplierIds: state.bannedSupplierIds,
      userSessions: state.userSessions,
    }),
    [now, period, state.bannedSupplierIds, state.conversations, state.importedServices, state.moderation, state.userSessions],
  );
  const chartMaximum = Math.max(
    1,
    ...analytics.activity.flatMap((bucket) => [bucket.conversations, bucket.users]),
  );

  function moderate(itemId: string, status: ModerationStatus) {
    const reason = reasons[itemId]?.trim() || (status === "approved" ? "Карточка соответствует правилам каталога" : "Требуется проверка данных карточки");
    updateModeration(itemId, status, reason);
    setNow(new Date());
    refresh();
  }

  function toggleBan(supplierId: string) {
    const isBanned = state.bannedSupplierIds.includes(supplierId);
    const reason = reasons[`supplier-${supplierId}`]?.trim() || (isBanned ? "Ограничение снято после проверки" : "Карточки скрыты до проверки администратором");
    setSupplierBanned(supplierId, !isBanned, reason);
    setNow(new Date());
    refresh();
  }

  function targetName(target: string) {
    const moderationItem = state.moderation.find((item) => item.id === target);
    if (moderationItem) return getServiceById(moderationItem.serviceId)?.title ?? "Карточка предложения";
    return getSupplierById(target)?.name ?? "Поставщик";
  }

  return (
    <div className="grid admin-dashboard" style={{ gap: 20 }}>
      <section className="panel admin-overview" aria-labelledby="admin-overview-title">
        <div className="toolbar admin-overview-toolbar">
          <div>
            <p className="eyebrow">Коротко о главном</p>
            <h2 id="admin-overview-title">Состояние платформы</h2>
            <p className="small muted">{analytics.periodLabel}. Онлайн — активность за последние 15 минут.</p>
          </div>
          <div className="period-switch" role="group" aria-label="Период отчёта">
            {periodOptions.map((option) => (
              <button
                className={period === option.value ? "active" : ""}
                key={option.value}
                type="button"
                aria-pressed={period === option.value}
                onClick={() => {
                  setPeriod(option.value);
                  setNow(new Date());
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-metric-grid">
          <MetricCard label="Поставщики" value={analytics.suppliersTotal} note={supplierRegistrationNote(analytics.suppliersNew)} accent="yellow" />
          <MetricCard label="Активные пользователи" value={analytics.activeUsers} note={comparisonText(analytics.activeUsers, analytics.previous.activeUsers)} />
          <MetricCard label="Сейчас онлайн" value={analytics.onlineUsers} note="уникальные аккаунты за 15 минут" accent="green" />
          <MetricCard label="Новые диалоги" value={analytics.conversations} note={comparisonText(analytics.conversations, analytics.previous.conversations)} />
          <MetricCard label="Поставщики ответили" value={analytics.responseRate === null ? "—" : `${analytics.responseRate}%`} note={analytics.conversations ? `${analytics.repliedConversations} из ${analytics.conversations} диалогов` : "в периоде пока нет диалогов"} />
          <MetricCard label="Первый ответ" value={responseTime(analytics.medianResponseMinutes)} note="медианное время ответа" />
        </div>

        <div className="admin-operations" aria-label="Текущее состояние каталога">
          <div><strong>{analytics.publishedServices}</strong><span>карточек опубликовано</span></div>
          <div><strong>{analytics.verifiedSuppliers}</strong><span>поставщиков проверено</span></div>
          <div><strong>{analytics.pendingModeration}</strong><span>ждут модерации</span></div>
          <div><strong>{analytics.bannedSuppliers}</strong><span>поставщиков заблокировано</span></div>
        </div>

        <div className="activity-chart" aria-label="Активность пользователей и новые диалоги за выбранный период">
          <div className="activity-chart-heading">
            <div><strong>Активность</strong><span>Входы пользователей и новые диалоги</span></div>
            <div className="activity-legend"><span><i className="legend-users" />Пользователи</span><span><i className="legend-conversations" />Диалоги</span></div>
          </div>
          <div className="activity-bars" style={{ gridTemplateColumns: `repeat(${analytics.activity.length}, minmax(32px, 1fr))` }}>
            {analytics.activity.map((bucket) => (
              <div className="activity-bucket" key={bucket.key} title={`${bucket.label}: пользователи — ${bucket.users}, диалоги — ${bucket.conversations}`}>
                <div className="bar-pair" aria-hidden="true">
                  <span className="bar-users" style={{ height: bucket.users ? `${Math.max(10, (bucket.users / chartMaximum) * 100)}%` : 2 }} />
                  <span className="bar-conversations" style={{ height: bucket.conversations ? `${Math.max(10, (bucket.conversations / chartMaximum) * 100)}%` : 2 }} />
                </div>
                <small>{bucket.label}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Новые карточки</p><h2>Проверка предложений</h2></div><StatusBadge tone="warning">{state.moderation.filter((item) => item.status === "pending").length} ожидает</StatusBadge></div>
        {state.moderation.map((item) => {
          const service = getServiceById(item.serviceId);
          const supplier = getSupplierById(item.supplierId);
          return <article className="moderation-row" key={item.id}><div><strong>{service?.title}</strong><br /><span className="small muted">{supplier?.name} · {item.reason}</span><div className="field" style={{ marginTop: 10 }}><label htmlFor={`reason-${item.id}`}>Комментарий</label><input id={`reason-${item.id}`} value={reasons[item.id] ?? ""} onChange={(event) => setReasons((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Почему принято это решение" /></div></div><div><StatusBadge tone={item.status === "approved" ? "success" : item.status === "hidden" ? "danger" : "warning"}>{moderationLabels[item.status]}</StatusBadge><div className="actions" style={{ marginTop: 10 }}><button className="button button-primary button-small" onClick={() => moderate(item.id, "approved")}>Одобрить</button><button className="button button-secondary button-small" onClick={() => moderate(item.id, "changes_requested")}>Вернуть</button><button className="button button-danger button-small" onClick={() => moderate(item.id, "hidden")}>Скрыть</button></div></div></article>;
        })}
      </section>

      <section className="panel">
        <p className="eyebrow">Проверка поставщиков</p><h2>Доступ к платформе</h2>
        {suppliers.map((supplier) => {
          const isBanned = state.bannedSupplierIds.includes(supplier.id);
          return <article className="moderation-row" key={supplier.id}><div><strong>{supplier.name}</strong><br /><span className="small muted">{supplier.city} · {supplier.verificationLabel}</span><div className="field" style={{ marginTop: 10 }}><label htmlFor={`ban-${supplier.id}`}>Причина блокировки / снятия</label><input id={`ban-${supplier.id}`} value={reasons[`supplier-${supplier.id}`] ?? ""} onChange={(event) => setReasons((current) => ({ ...current, [`supplier-${supplier.id}`]: event.target.value }))} /></div></div><div><StatusBadge tone={isBanned ? "danger" : "success"}>{isBanned ? "Заблокирован" : "Активен"}</StatusBadge><div style={{ marginTop: 10 }}><button className={`button button-small ${isBanned ? "button-secondary" : "button-danger"}`} onClick={() => toggleBan(supplier.id)}>{isBanned ? "Разблокировать" : "Заблокировать"}</button></div></div></article>;
        })}
      </section>

      <section className="panel"><p className="eyebrow">Что изменилось</p><h2>Последние действия</h2>{state.audit.length ? <div className="table-wrap"><table><thead><tr><th>Когда</th><th>Что сделано</th><th>Карточка или поставщик</th><th>Комментарий</th></tr></thead><tbody>{state.audit.map((entry) => <tr key={entry.id}><td>{formatDateTime(entry.createdAt)}</td><td>{actionLabels[entry.action] ?? "Изменение сохранено"}</td><td>{targetName(entry.target)}</td><td>{entry.reason}</td></tr>)}</tbody></table></div> : <div className="empty-state">Здесь появятся последние изменения.</div>}</section>
    </div>
  );
}

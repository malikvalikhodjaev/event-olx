"use client";

import { useState } from "react";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { getServiceById, getSupplierById, suppliers } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";
import { setSupplierBanned, updateModeration } from "@/lib/demo-store";
import type { ModerationStatus } from "@/lib/types";

const moderationLabels: Record<ModerationStatus, string> = { pending: "Ожидает", approved: "Одобрена", changes_requested: "Нужны правки", hidden: "Скрыта" };

export function AdminDashboard() {
  const { state, refresh } = useDemoSession();
  const [reasons, setReasons] = useState<Record<string, string>>({});

  function moderate(itemId: string, status: ModerationStatus) {
    const reason = reasons[itemId]?.trim() || (status === "approved" ? "Карточка соответствует правилам каталога" : "Требуется проверка данных карточки");
    updateModeration(itemId, status, reason);
    refresh();
  }

  function toggleBan(supplierId: string) {
    const isBanned = state.bannedSupplierIds.includes(supplierId);
    const reason = reasons[`supplier-${supplierId}`]?.trim() || (isBanned ? "Ограничение снято после проверки" : "Карточки скрыты до проверки администратором");
    setSupplierBanned(supplierId, !isBanned, reason);
    refresh();
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Очередь контроля</p><h2>Модерация услуг</h2></div><StatusBadge tone="warning">{state.moderation.filter((item) => item.status === "pending").length} ожидает</StatusBadge></div>
        {state.moderation.map((item) => {
          const service = getServiceById(item.serviceId);
          const supplier = getSupplierById(item.supplierId);
          return <article className="moderation-row" key={item.id}><div><strong>{service?.title}</strong><br /><span className="small muted">{supplier?.name} · {item.reason}</span><div className="field" style={{ marginTop: 10 }}><label htmlFor={`reason-${item.id}`}>Основание решения</label><input id={`reason-${item.id}`} value={reasons[item.id] ?? ""} onChange={(event) => setReasons((current) => ({ ...current, [item.id]: event.target.value }))} placeholder="Фактическая причина для журнала аудита" /></div></div><div><StatusBadge tone={item.status === "approved" ? "success" : item.status === "hidden" ? "danger" : "warning"}>{moderationLabels[item.status]}</StatusBadge><div className="actions" style={{ marginTop: 10 }}><button className="button button-primary button-small" onClick={() => moderate(item.id, "approved")}>Одобрить</button><button className="button button-secondary button-small" onClick={() => moderate(item.id, "changes_requested")}>Вернуть</button><button className="button button-danger button-small" onClick={() => moderate(item.id, "hidden")}>Скрыть</button></div></div></article>;
        })}
      </section>

      <section className="panel">
        <p className="eyebrow">Защитная мера</p><h2>Поставщики и блокировки</h2>
        {suppliers.map((supplier) => {
          const isBanned = state.bannedSupplierIds.includes(supplier.id);
          return <article className="moderation-row" key={supplier.id}><div><strong>{supplier.name}</strong><br /><span className="small muted">{supplier.city} · {supplier.verificationLabel}</span><div className="field" style={{ marginTop: 10 }}><label htmlFor={`ban-${supplier.id}`}>Причина блокировки / снятия</label><input id={`ban-${supplier.id}`} value={reasons[`supplier-${supplier.id}`] ?? ""} onChange={(event) => setReasons((current) => ({ ...current, [`supplier-${supplier.id}`]: event.target.value }))} /></div></div><div><StatusBadge tone={isBanned ? "danger" : "success"}>{isBanned ? "Заблокирован" : "Активен"}</StatusBadge><div style={{ marginTop: 10 }}><button className={`button button-small ${isBanned ? "button-secondary" : "button-danger"}`} onClick={() => toggleBan(supplier.id)}>{isBanned ? "Разблокировать" : "Заблокировать"}</button></div></div></article>;
        })}
      </section>

      <section className="panel"><p className="eyebrow">Неизменяемая история в production</p><h2>Журнал действий</h2>{state.audit.length ? <div className="table-wrap"><table><thead><tr><th>Когда</th><th>Действие</th><th>Объект</th><th>Причина</th></tr></thead><tbody>{state.audit.map((entry) => <tr key={entry.id}><td>{formatDateTime(entry.createdAt)}</td><td>{entry.action}</td><td>{entry.target}</td><td>{entry.reason}</td></tr>)}</tbody></table></div> : <div className="empty-state">Изменений пока нет. Выполните действие модерации.</div>}</section>
    </div>
  );
}

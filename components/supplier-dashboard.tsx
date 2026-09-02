"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { services, getServiceById, offerKindLabels } from "@/lib/demo-data";
import { formatDateTime, formatMoney } from "@/lib/format";

const supplierId = "supplier-silk-road";

export function SupplierDashboard() {
  const { state } = useDemoSession();
  const conversations = state.conversations
    .filter((conversation) => conversation.supplierId === supplierId)
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  const ownServices = [...services, ...state.importedServices].filter((service) => service.supplierId === supplierId);
  const waitingForReply = conversations.filter((conversation) => !conversation.firstSupplierResponseAt).length;

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="grid grid-3">
        <article className="card"><p className="eyebrow">Ждут ответа</p><h2>{waitingForReply}</h2><span className="muted small">Откройте чат и ответьте клиенту</span></article>
        <article className="card"><p className="eyebrow">Предложения</p><h2>{ownServices.length}</h2><span className="muted small">{ownServices.filter((item) => item.published).length} опубликовано</span></article>
        <article className="card"><p className="eyebrow">Не опубликованы</p><h2>{state.importedServices.length}</h2><span className="muted small">Станут видны клиентам после проверки</span></article>
      </section>

      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Сообщения клиентов</p><h2>Последние диалоги</h2></div><Link className="button button-primary button-small" href="/chats">Открыть все чаты</Link></div>
        {conversations.length ? conversations.map((conversation) => {
          const lastMessage = conversation.messages.at(-1);
          return (
            <article className="conversation-row" key={conversation.id}>
              <div>
                <strong>{getServiceById(conversation.serviceId)?.title ?? "Предложение"}</strong><br />
                <span className="small muted">{conversation.clientName} · {formatDateTime(conversation.updatedAt)}</span><br />
                <span className="small">{lastMessage?.text}</span>
              </div>
              <div><StatusBadge tone={conversation.firstSupplierResponseAt ? "success" : "warning"}>{conversation.firstSupplierResponseAt ? "Ответили" : "Ждёт ответа"}</StatusBadge></div>
              <Link className="button button-secondary button-small" href={`/chats?conversation=${conversation.id}`}>Открыть чат</Link>
            </article>
          );
        }) : <div className="empty-state">Сообщений от клиентов пока нет.</div>}
      </section>

      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Ваш каталог</p><h2>Мои предложения</h2></div><Link className="button button-primary" href="/supplier/import">Загрузить цены из Excel</Link></div>
        <div className="table-wrap"><table><thead><tr><th>Предложение</th><th>Формат</th><th>Цена от</th><th>Статус</th><th>Обновлено</th></tr></thead><tbody>{ownServices.map((service) => (
          <tr key={service.id}><td><strong>{service.title}</strong><br /><span className="muted">{service.sku} · {service.city}</span></td><td>{offerKindLabels[service.offerKind]}</td><td>{formatMoney(service.priceFrom)} · {service.priceUnit}</td><td><StatusBadge tone={service.published ? "success" : "warning"}>{service.published ? "Опубликовано" : "Черновик"}</StatusBadge></td><td>{formatDateTime(service.updatedAt)}</td></tr>
        ))}</tbody></table></div>
      </section>

      <section className="panel">
        <p className="eyebrow">Договорённости</p><h2>Что подтвердить в чате</h2>
        <div className="callout callout-warning">Переписка не означает бронь. Явно подтвердите клиенту дату, итоговую цену, состав предложения и способ оплаты.</div>
        <div className="metric-list">
          <div className="metric"><span>Дата и время</span><strong>Подтвердить</strong></div>
          <div className="metric"><span>Итоговая цена</span><strong>Зафиксировать</strong></div>
          <div className="metric"><span>Что входит</span><strong>Перечислить</strong></div>
          <div className="metric"><span>Бронь и оплата</span><strong>Согласовать отдельно</strong></div>
        </div>
      </section>
    </div>
  );
}

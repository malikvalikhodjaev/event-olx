"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { services, getServiceById } from "@/lib/demo-data";
import { formatDateTime, formatMoney } from "@/lib/format";
import { updateDemoRequest } from "@/lib/demo-store";
import type { RequestStatus } from "@/lib/types";

const supplierId = "supplier-silk-road";
const statusLabels: Record<RequestStatus, string> = {
  submitted: "Новая",
  viewed: "Просмотрена",
  accepted_for_discussion: "Принята к обсуждению",
  declined: "Отклонена",
  closed: "Закрыта",
};

export function SupplierDashboard() {
  const { state, refresh } = useDemoSession();
  const supplierRequests = state.requests.filter((request) => request.supplierId === supplierId);
  const ownServices = [...services, ...state.importedServices].filter((service) => service.supplierId === supplierId);

  function changeStatus(requestId: string, status: RequestStatus) {
    const now = new Date().toISOString();
    updateDemoRequest(requestId, {
      status,
      firstViewedAt: status !== "submitted" ? now : null,
      firstRespondedAt: ["accepted_for_discussion", "declined"].includes(status) ? now : null,
    });
    refresh();
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="grid grid-3">
        <article className="card"><p className="eyebrow">Новые заявки</p><h2>{supplierRequests.filter((item) => item.status === "submitted").length}</h2><span className="muted small">Нужно открыть и дать ясный ответ</span></article>
        <article className="card"><p className="eyebrow">Услуги</p><h2>{ownServices.length}</h2><span className="muted small">{ownServices.filter((item) => item.published).length} опубликовано</span></article>
        <article className="card"><p className="eyebrow">Неопубликованные услуги</p><h2>{state.importedServices.length}</h2><span className="muted small">Станут видны клиентам после проверки</span></article>
      </section>

      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Заявки клиентов</p><h2>Новые обращения</h2></div><StatusBadge tone="warning">Ждут вашего ответа</StatusBadge></div>
        {supplierRequests.length ? supplierRequests.map((request) => (
          <article className="request-row" key={request.id}>
            <div>
              <strong>{getServiceById(request.serviceId)?.title ?? "Услуга"}</strong><br />
              <span className="small muted">{request.clientName} · {request.eventType} · {request.eventDate} · {request.guestCount} гостей</span><br />
              <span className="small">{request.message}</span>
            </div>
            <div><StatusBadge tone={request.status === "declined" ? "danger" : request.status === "accepted_for_discussion" ? "success" : "warning"}>{statusLabels[request.status]}</StatusBadge><br /><span className="small muted">Бюджет: {formatMoney(request.budget)}</span></div>
            <div className="actions" style={{ marginTop: 0 }}>
              {request.status === "submitted" ? <button className="button button-secondary button-small" onClick={() => changeStatus(request.id, "viewed")}>Отметить просмотренной</button> : null}
              {!request.firstRespondedAt ? <><button className="button button-primary button-small" onClick={() => changeStatus(request.id, "accepted_for_discussion")}>Принять к обсуждению</button><button className="button button-danger button-small" onClick={() => changeStatus(request.id, "declined")}>Отклонить</button></> : <span className="small muted">Первый ответ: {formatDateTime(request.firstRespondedAt)}</span>}
            </div>
          </article>
        )) : <div className="empty-state">Новых заявок нет.</div>}
      </section>

      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Ваши предложения</p><h2>Мои услуги</h2></div><Link className="button button-primary" href="/supplier/import">Загрузить цены из Excel</Link></div>
        <div className="table-wrap"><table><thead><tr><th>Услуга</th><th>Цена от</th><th>Статус</th><th>Обновлено</th></tr></thead><tbody>{ownServices.map((service) => (
          <tr key={service.id}><td><strong>{service.title}</strong><br /><span className="muted">{service.city}</span></td><td>{formatMoney(service.priceFrom)} · {service.priceUnit}</td><td><StatusBadge tone={service.published ? "success" : "warning"}>{service.published ? "Опубликована" : "Черновик"}</StatusBadge></td><td>{formatDateTime(service.updatedAt)}</td></tr>
        ))}</tbody></table></div>
      </section>

      <section className="panel">
        <p className="eyebrow">Свободные даты</p><h2>Ближайшие события</h2>
        <div className="callout callout-warning">Даты в заявках ещё не забронированы. Сначала подтвердите дату с клиентом, а затем отмечайте её занятой.</div>
        <div className="metric-list">{supplierRequests.map((request) => <div className="metric" key={request.id}><span>{request.eventDate} · {request.eventType}</span><strong>{statusLabels[request.status]}</strong></div>)}</div>
      </section>
    </div>
  );
}

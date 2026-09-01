"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { getServiceById, getSupplierById } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";
import type { RequestStatus } from "@/lib/types";

const labels: Record<RequestStatus, string> = {
  submitted: "Отправлена",
  viewed: "Просмотрена",
  accepted_for_discussion: "Принята к обсуждению",
  declined: "Отклонена",
  closed: "Закрыта",
};

export function RequestList() {
  const { state } = useDemoSession();
  return (
    <section className="panel">
      <div className="toolbar"><h2>Мои заявки</h2><Link className="button button-primary button-small" href="/requests/new">Новая заявка</Link></div>
      {state.requests.length ? state.requests.map((request) => {
        const service = getServiceById(request.serviceId);
        const supplier = getSupplierById(request.supplierId);
        return (
          <article className="request-row" key={request.id}>
            <div>
              <strong>{service?.title ?? "Услуга из Excel"}</strong><br />
              <span className="small muted">{supplier?.name ?? "Поставщик"} · {request.eventType} · {request.eventDate}</span>
            </div>
            <div><StatusBadge tone={request.status === "declined" ? "danger" : request.status === "accepted_for_discussion" ? "success" : "warning"}>{labels[request.status]}</StatusBadge></div>
            <div className="small muted">{formatDateTime(request.createdAt)}</div>
          </article>
        );
      }) : <div className="empty-state">Заявок пока нет.</div>}
    </section>
  );
}

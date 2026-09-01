"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { addToShortlist } from "@/lib/demo-store";
import { getCategoryById, getSupplierById } from "@/lib/demo-data";
import { formatMoney, freshnessState, responseLabel } from "@/lib/format";
import type { Service } from "@/lib/types";

export function ServiceCard({ service }: { service: Service }) {
  const { state, refresh } = useDemoSession();
  const supplier = getSupplierById(service.supplierId);
  const category = getCategoryById(service.categoryId);
  const freshness = freshnessState(service.updatedAt);
  const shortlisted = state.shortlist.includes(service.id);

  if (!supplier || !category) return null;

  return (
    <article className="card service-card" data-testid="service-card">
      <div className="badge-row">
        <StatusBadge>{category.name}</StatusBadge>
        <StatusBadge tone={freshness.tone}>{freshness.label}</StatusBadge>
        {supplier.verified ? <StatusBadge tone="success">Поставщик проверен</StatusBadge> : null}
      </div>
      <h3>{service.title}</h3>
      <p className="small muted">{supplier.name} · {service.city}</p>
      <p className="muted">{service.description}</p>
      <p className="service-price">от {formatMoney(service.priceFrom)} <span className="small muted">{service.priceUnit}</span></p>
      <p className="small muted">{responseLabel(supplier.responseMedianMinutes, supplier.responseSampleSize)}</p>
      <div className="service-actions">
        <Link className="button button-primary button-small" href={`/suppliers/${supplier.slug}`}>Подробнее</Link>
        <button
          className="button button-secondary button-small"
          type="button"
          aria-pressed={shortlisted}
          onClick={() => {
            addToShortlist(service.id);
            refresh();
          }}
        >
          {shortlisted ? "Убрать из shortlist" : "В shortlist"}
        </button>
      </div>
    </article>
  );
}

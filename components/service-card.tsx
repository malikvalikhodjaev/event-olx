"use client";

import Link from "next/link";
import Image from "next/image";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { addToShortlist } from "@/lib/demo-store";
import { getCategoryById, getSupplierById, offerKindLabels } from "@/lib/demo-data";
import { formatMoney, freshnessState, responseLabel } from "@/lib/format";
import type { Service } from "@/lib/types";

const sectionImages = {
  services: "/catalog-services-v1.png",
  market: "/catalog-market-v1.png",
  equipment: "/catalog-equipment-v1.png",
} as const;

export function ServiceCard({ service }: { service: Service }) {
  const { state, refresh } = useDemoSession();
  const supplier = getSupplierById(service.supplierId);
  const category = getCategoryById(service.categoryId);
  const freshness = freshnessState(service.updatedAt);
  const shortlisted = state.shortlist.includes(service.id);
  const chatDestination = `/chats?service=${encodeURIComponent(service.id)}`;

  if (!supplier || !category) return null;

  return (
    <article className="card service-card" data-testid="service-card">
      <div className="service-card-media">
        <Image
          src={sectionImages[category.section]}
          alt=""
          fill
          sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 25vw"
        />
        <div className="service-card-kind">
          <StatusBadge tone={service.offerKind === "sale" ? "success" : service.offerKind === "rental" ? "warning" : "neutral"}>{offerKindLabels[service.offerKind]}</StatusBadge>
        </div>
        <button
          className="service-card-favorite"
          type="button"
          aria-label={shortlisted ? "Убрать из сохранённых" : "Сохранить"}
          aria-pressed={shortlisted}
          onClick={() => {
            addToShortlist(service.id);
            refresh();
          }}
        >
          <span aria-hidden="true">{shortlisted ? "♥" : "♡"}</span>
        </button>
      </div>
      <div className="service-card-body">
        <p className="service-card-category">{category.name}</p>
        <h3><Link href={`/suppliers/${supplier.slug}`}>{service.title}</Link></h3>
        <p className="service-card-description">{service.description}</p>
        <p className="service-price">от {formatMoney(service.priceFrom)} <span>{service.priceUnit}</span></p>
        <p className="service-card-meta">{service.city} · {supplier.name}</p>
        <div className="service-card-signals">
          <span className={freshness.tone === "danger" ? "signal-warning" : ""}>{freshness.label}</span>
          {supplier.verified ? <span className="signal-positive">✓ Поставщик проверен</span> : null}
        </div>
        <div className="service-card-footer">
          <span>{responseLabel(supplier.responseMedianMinutes, supplier.responseSampleSize)}</span>
          <Link className="service-details-link" href={`/suppliers/${supplier.slug}`}>Подробнее →</Link>
        </div>
        <div className="service-card-actions">
          <Link className="button button-primary button-small" href={chatDestination}>Написать поставщику</Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { addToShortlist } from "@/lib/demo-store";
import { getCategoryById, getSupplierById } from "@/lib/demo-data";
import { formatMoney, freshnessState, responseLabel } from "@/lib/format";
import type { Service } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";
import { categoryName, cityName, offerKindLabelsByLocale, priceUnit, serviceDescription, serviceTitle } from "@/lib/i18n";

export function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  const { state, refresh } = useDemoSession();
  const { locale, text } = useLocale();
  const supplier = getSupplierById(service.supplierId);
  const category = getCategoryById(service.categoryId);
  const freshness = freshnessState(service.updatedAt, undefined, locale);
  const shortlisted = state.shortlist.includes(service.id);
  const chatDestination = `/chats?service=${encodeURIComponent(service.id)}`;
  const localizedTitle = serviceTitle(locale, service);
  const localizedDescription = serviceDescription(locale, service);

  if (!supplier || !category) return null;

  return (
    <article className="card service-card" data-testid="service-card">
      <div className="service-card-media">
        <Image
          src={service.imageUrl}
          alt={`${text("Фото предложения", "Taklif surati")} «${localizedTitle}»`}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 25vw"
        />
        <div className="service-card-kind">
          <StatusBadge tone={service.offerKind === "sale" ? "success" : service.offerKind === "rental" ? "warning" : "neutral"}>{offerKindLabelsByLocale[locale][service.offerKind]}</StatusBadge>
        </div>
        <button
          className="service-card-favorite"
          type="button"
          aria-label={shortlisted ? text("Убрать из сохранённых", "Saqlanganlardan olib tashlash") : text("Сохранить", "Saqlash")}
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
        <p className="service-card-category">{categoryName(locale, category)}</p>
        <h3><Link href={`/offers/${service.id}`}>{localizedTitle}</Link></h3>
        <p className="service-card-description">{localizedDescription}</p>
        <p className="service-price">{text("от", "dan")} {formatMoney(service.priceFrom, locale)} <span>{priceUnit(locale, service.priceUnit)}</span></p>
        <p className="service-card-meta">{cityName(locale, service.city)} · {supplier.name}</p>
        <div className="service-card-signals">
          <span className={freshness.tone === "danger" ? "signal-warning" : ""}>{freshness.label}</span>
          {supplier.verified ? <span className="signal-positive">✓ {text("Автор предложения проверен", "E’lon muallifi tekshirilgan")}</span> : null}
        </div>
        <div className="service-card-footer">
          <span>{responseLabel(supplier.responseMedianMinutes, supplier.responseSampleSize, locale)}</span>
          <Link className="service-details-link" href={`/offers/${service.id}`}>{text("Подробнее", "Batafsil")} →</Link>
        </div>
        <div className="service-card-actions">
          <Link className="button button-primary button-small" href={chatDestination}>{text("Написать автору", "Muallifga yozish")}</Link>
        </div>
      </div>
    </article>
  );
}

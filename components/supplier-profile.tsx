"use client";

import Link from "next/link";
import { ServiceCard } from "@/components/service-card";
import { StatusBadge } from "@/components/status-badge";
import { useLocale } from "@/components/locale-provider";
import { cityName } from "@/lib/i18n";
import { formatDateTime, freshnessState, responseLabel } from "@/lib/format";
import type { Service, Supplier } from "@/lib/types";

export function SupplierProfile({ supplier, services }: { supplier: Supplier; services: Service[] }) {
  const { locale, text } = useLocale();
  const freshness = freshnessState(supplier.updatedAt, undefined, locale);
  const verificationLabel = locale === "uz"
    ? supplier.verified ? "E’lon muallifi tekshirilgan" : "Muallif tekshiruvi yakunlanmagan"
    : supplier.verificationLabel.replaceAll("поставщика", "автора предложения");

  return (
    <>
      <header className="page-intro">
        <div className="badge-row">
          <StatusBadge tone={supplier.verified ? "success" : "warning"}>{verificationLabel}</StatusBadge>
          <StatusBadge tone={freshness.tone}>{freshness.label}</StatusBadge>
        </div>
        <h1>{supplier.name}</h1>
        <p className="lead">{supplier.description}</p>
      </header>
      <div className="split">
        <section>
          <div className="section-heading"><div><p className="eyebrow">{text("Каталог автора", "Muallif katalogi")}</p><h2>{text("Все предложения", "Barcha takliflar")}</h2></div></div>
          <div className="grid grid-2">
            {services.map((service, index) => <ServiceCard key={service.id} service={service} priority={index === 0} />)}
          </div>
          <section className="section">
            <p className="eyebrow">{text("Портфолио", "Portfolio")}</p>
            <div className="grid grid-3">
              {supplier.portfolio.map((item, index) => (
                <article className="card card-muted" key={item}>
                  <div className="category-icon">{index + 1}</div>
                  <strong>{item}</strong>
                </article>
              ))}
            </div>
          </section>
        </section>
        <aside className="panel sticky-panel">
          <p className="eyebrow">{text("Об авторе", "Muallif haqida")}</p>
          <h3>{text("Полезно знать перед разговором", "Suhbatdan oldin bilish foydali")}</h3>
          <div className="metric-list">
            <div className="metric"><span>{text("Город", "Shahar")}</span><strong>{cityName(locale, supplier.city)}</strong></div>
            <div className="metric"><span>{text("Профиль обновлён", "Profil yangilangan")}</span><strong>{formatDateTime(supplier.updatedAt, locale)}</strong></div>
            <div className="metric"><span>{text("Скорость ответа", "Javob tezligi")}</span><strong>{responseLabel(supplier.responseMedianMinutes, supplier.responseSampleSize, locale)}</strong></div>
            <div className="metric"><span>{text("Учтено", "Hisobga olingan")}</span><strong>{supplier.responseSampleSize} {text("диалогов", "suhbat")}</strong></div>
          </div>
          <div className="callout callout-warning" style={{ marginTop: 16 }}>
            {text("Напишите автору и уточните цену, наличие или свободную дату. Сообщение само по себе не подтверждает бронь.", "Muallifga yozib, narx, mavjudlik yoki bo‘sh sanani aniqlashtiring. Xabarning o‘zi bronni tasdiqlamaydi.")}
          </div>
          {services[0] ? (
            <Link className="button button-primary" style={{ width: "100%", marginTop: 16 }} href={`/chats?service=${services[0].id}`}>
              {text("Написать автору", "Muallifga yozish")}
            </Link>
          ) : null}
        </aside>
      </div>
    </>
  );
}

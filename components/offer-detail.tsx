"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDemoSession } from "@/components/demo-session";
import { useLocale } from "@/components/locale-provider";
import { StatusBadge } from "@/components/status-badge";
import { OfferEstimateBuilder } from "@/components/offer-estimate-builder";
import { addToShortlist, queueShortlistAfterSignIn } from "@/lib/demo-store";
import { getCategoryById, getSupplierById } from "@/lib/demo-data";
import { formatDateTime, formatMoney, freshnessState, responseLabel } from "@/lib/format";
import { categoryName, cityName, offerKindLabelsByLocale, priceUnit, serviceDescription, serviceTitle } from "@/lib/i18n";
import { getOfferDetails } from "@/lib/offer-details";
import type { LocalizedCopy, Service } from "@/lib/types";

type OfferDetailProps = {
  initialService: Service | null;
  serviceId: string;
  preview: boolean;
  calculatorOpen: boolean;
};

export function OfferDetail({ initialService, serviceId, preview, calculatorOpen }: OfferDetailProps) {
  const router = useRouter();
  const { state, refresh } = useDemoSession();
  const { locale, text } = useLocale();
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(calculatorOpen);
  const service = initialService ?? state.importedServices.find((item) => item.id === serviceId) ?? null;
  const supplier = service ? getSupplierById(service.supplierId) : undefined;
  const category = service ? getCategoryById(service.categoryId) : undefined;
  const details = useMemo(() => service ? getOfferDetails(service) : null, [service]);
  const selectedMedia = details?.media.find((item) => item.id === selectedMediaId);

  useEffect(() => {
    if (!selectedMediaId) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMediaId(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedMediaId]);

  if (!service || !supplier || !category || !details) {
    return (
      <section className="empty-state offer-not-found">
        <h1>{text("Предложение не найдено", "Taklif topilmadi")}</h1>
        <p>{text("Возможно, автор снял его с публикации или ссылка устарела.", "Muallif e’lonni olib tashlagan yoki havola eskirgan bo‘lishi mumkin.")}</p>
        <Link className="button button-primary" href="/catalog">{text("Вернуться в каталог", "Katalogga qaytish")}</Link>
      </section>
    );
  }

  const freshness = freshnessState(service.updatedAt, undefined, locale);
  const shortlisted = state.signedIn && state.shortlist.includes(service.id);
  const localized = (value: LocalizedCopy) => value[locale];
  const localizedTitle = serviceTitle(locale, service);
  const localizedDescription = serviceDescription(locale, service);

  return (
    <article className="offer-detail-page">
      {preview && !service.published ? (
        <div className="offer-preview-bar" role="status">
          <span><strong>{text("Предпросмотр", "Ko‘rib chiqish")}</strong> · {text("эту страницу пока видите только вы", "bu sahifani hozircha faqat siz ko‘rasiz")}</span>
          <StatusBadge tone="warning">{text("Черновик", "Qoralama")}</StatusBadge>
        </div>
      ) : null}

      <nav className="offer-breadcrumbs" aria-label={text("Навигация", "Navigatsiya")}>
        <Link href="/catalog">{text("Каталог", "Katalog")}</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/catalog?category=${encodeURIComponent(category.id)}`}>{categoryName(locale, category)}</Link>
      </nav>

      <section className="offer-hero">
        <button className="offer-cover" type="button" onClick={() => setSelectedMediaId(details.media[0]?.id ?? null)} aria-label={text("Увеличить главную фотографию", "Asosiy suratni kattalashtirish")}>
          <Image src={service.imageUrl} alt={`${text("Главная фотография", "Asosiy surat")} — ${localizedTitle}`} fill unoptimized priority sizes="(max-width: 900px) 100vw, 58vw" />
          <span className="offer-cover-hint">↗ {text("Увеличить", "Kattalashtirish")}</span>
        </button>

        <div className="offer-hero-copy">
          <div className="badge-row">
            <StatusBadge tone={service.offerKind === "sale" ? "success" : service.offerKind === "rental" ? "warning" : "neutral"}>{offerKindLabelsByLocale[locale][service.offerKind]}</StatusBadge>
            <StatusBadge tone={freshness.tone}>{freshness.label}</StatusBadge>
            {supplier.verified ? <StatusBadge tone="success">✓ {text("Автор проверен", "Muallif tekshirilgan")}</StatusBadge> : null}
          </div>
          <p className="eyebrow">{categoryName(locale, category)}</p>
          <h1>{localizedTitle}</h1>
          <p className="offer-summary">{localizedDescription}</p>
          <p className="offer-price">{text("от", "dan")} {formatMoney(service.priceFrom, locale)} <span>{priceUnit(locale, service.priceUnit)}</span></p>
          <p className="offer-location">⌖ {cityName(locale, service.city)} · {localized(details.serviceArea)}</p>
          <div className="offer-primary-actions">
            <Link className="button button-primary" href={`/chats?service=${encodeURIComponent(service.id)}`}>{text("Написать автору", "Muallifga yozish")}</Link>
            <button className="button button-secondary" type="button" aria-expanded={showCalculator} aria-controls="offer-estimate-title" onClick={() => setShowCalculator((current) => !current)}>{text("Рассчитать", "Hisoblash")}</button>
            <button
              className="button button-secondary"
              type="button"
              aria-pressed={shortlisted}
              onClick={() => {
                if (!state.signedIn) {
                  queueShortlistAfterSignIn(service.id);
                  const next = `${window.location.pathname}${window.location.search}`;
                  router.push(`/login?role=client&next=${encodeURIComponent(next)}`);
                  return;
                }
                addToShortlist(service.id);
                refresh();
              }}
            >
              {shortlisted ? `♥ ${text("Сохранено", "Saqlandi")}` : `♡ ${text("Сохранить", "Saqlash")}`}
            </button>
          </div>
        </div>
      </section>

      {showCalculator ? <OfferEstimateBuilder service={service} onClose={() => setShowCalculator(false)} /> : null}

      <div className="offer-layout">
        <div className="offer-content">
          <section className="offer-section">
            <p className="eyebrow">{text("О предложении", "Taklif haqida")}</p>
            <h2>{text("Что вы получите", "Nima olasiz")}</h2>
            <p className="offer-long-copy">{localized(details.fullDescription)}</p>
            <div className="offer-tags" aria-label={text("Подходит для событий", "Tadbirlar uchun mos")}>{details.eventTypes.map((eventType) => <span key={eventType.ru}>{localized(eventType)}</span>)}</div>
          </section>

          {details.person ? (
            <section className="offer-section">
              <p className="eyebrow">{text("Кто будет работать", "Kim ishlaydi")}</p>
              <h2>{text("Исполнитель", "Ijrochi")}</h2>
              <div className="offer-person">
                <div className="offer-person-photo"><Image src={details.person.photoUrl} alt={details.person.name} fill unoptimized sizes="144px" /></div>
                <div>
                  <h3>{details.person.name}</h3>
                  <p>{localized(details.person.role)}</p>
                  <dl className="offer-person-facts">
                    <div><dt>{text("Пол", "Jinsi")}</dt><dd>{localized(details.person.gender)}</dd></div>
                    <div><dt>{text("Возраст", "Yoshi")}</dt><dd>{details.person.age}</dd></div>
                    <div><dt>{text("Опыт", "Tajriba")}</dt><dd>{details.person.experienceYears} {text("лет", "yil")}</dd></div>
                    <div><dt>{text("Языки", "Tillar")}</dt><dd>{localized(details.person.languages)}</dd></div>
                  </dl>
                </div>
              </div>
            </section>
          ) : null}

          <section className="offer-section">
            <p className="eyebrow">{text("Варианты", "Variantlar")}</p>
            <h2>{text("Пакеты и состав", "Paketlar va tarkibi")}</h2>
            <div className="offer-packages">
              {details.packages.map((offerPackage) => (
                <article className={`offer-package ${offerPackage.highlighted ? "offer-package-highlighted" : ""}`} key={offerPackage.name.ru}>
                  {offerPackage.highlighted ? <span className="offer-package-label">{text("Чаще выбирают", "Ko‘proq tanlanadi")}</span> : null}
                  <h3>{localized(offerPackage.name)}</h3>
                  <p>{localized(offerPackage.summary)}</p>
                  <strong>{text("от", "dan")} {formatMoney(offerPackage.priceFrom, locale)}</strong>
                  <ul>{offerPackage.includes.map((item) => <li key={item.ru}>✓ {localized(item)}</li>)}</ul>
                </article>
              ))}
            </div>
          </section>

          <section className="offer-section" data-testid="offer-portfolio">
            <p className="eyebrow">{text("Портфолио", "Portfolio")}</p>
            <h2>{text("Примеры работ", "Ish namunalari")}</h2>
            <p className="muted">{text("Нажмите на фотографию, чтобы рассмотреть её крупнее.", "Suratni kattaroq ko‘rish uchun ustiga bosing.")}</p>
            <div className="offer-gallery">
              {details.media.map((media, index) => media.type === "image" ? (
                <button className={index === 0 ? "offer-gallery-item offer-gallery-item-wide" : "offer-gallery-item"} type="button" key={media.id} onClick={() => setSelectedMediaId(media.id)} aria-label={`${text("Увеличить", "Kattalashtirish")}: ${localized(media.title)}`}>
                  <Image src={media.url} alt={localized(media.title)} fill unoptimized sizes="(max-width: 620px) 50vw, 30vw" />
                  <span>{localized(media.title)}</span>
                </button>
              ) : (
                <a className="offer-gallery-video" href={media.url} target="_blank" rel="noreferrer" key={media.id}>▶ {localized(media.title)}</a>
              ))}
            </div>
          </section>

          <section className="offer-section">
            <p className="eyebrow">{text("Характеристики", "Xususiyatlar")}</p>
            <h2>{text("Важные детали", "Muhim tafsilotlar")}</h2>
            <dl className="offer-facts">
              {details.facts.map((fact) => <div key={fact.label.ru}><dt>{localized(fact.label)}</dt><dd>{localized(fact.value)}</dd></div>)}
              <div><dt>{text("Территория", "Hudud")}</dt><dd>{localized(details.serviceArea)}</dd></div>
              <div><dt>{text("Выезд", "Safar")}</dt><dd>{localized(details.travelTerms)}</dd></div>
            </dl>
          </section>
        </div>

        <aside className="offer-sidebar">
          <section className="panel sticky-panel offer-contact-card">
            <p className="eyebrow">{text("Автор предложения", "E’lon muallifi")}</p>
            <h2><Link href={`/suppliers/${supplier.slug}`}>{supplier.name}</Link></h2>
            <p>{supplier.description}</p>
            <div className="metric-list">
              <div className="metric"><span>{text("Город", "Shahar")}</span><strong>{cityName(locale, supplier.city)}</strong></div>
              <div className="metric"><span>{text("Скорость ответа", "Javob tezligi")}</span><strong>{responseLabel(supplier.responseMedianMinutes, supplier.responseSampleSize, locale)}</strong></div>
              <div className="metric"><span>{text("Предложение обновлено", "Taklif yangilangan")}</span><strong>{formatDateTime(service.updatedAt, locale)}</strong></div>
              <div className="metric"><span>{text("Дата или наличие", "Sana yoki mavjudlik")}</span><strong>{localized(details.availabilityNote)}</strong></div>
            </div>
            <Link className="button button-primary" href={`/chats?service=${encodeURIComponent(service.id)}`}>{text("Написать автору", "Muallifga yozish")}</Link>
            <Link className="button button-secondary" href={`/suppliers/${supplier.slug}`}>{text("Все предложения автора", "Muallifning barcha takliflari")}</Link>
          </section>
          <div className="callout callout-warning offer-guardrail">
            <strong>{text("Важно до оплаты", "To‘lovdan oldin muhim")}</strong>
            <p>{text("Цена «от» и свободная дата ориентировочные. Сообщение в чате не является бронью или оплатой — подтвердите итоговые условия отдельно.", "Boshlang‘ich narx va bo‘sh sana taxminiy. Suhbatdagi xabar bron yoki to‘lov hisoblanmaydi — yakuniy shartlarni alohida tasdiqlang.")}</p>
          </div>
        </aside>
      </div>

      {selectedMedia?.type === "image" ? (
        <div className="offer-lightbox" role="dialog" aria-modal="true" aria-label={text("Увеличенная фотография", "Kattalashtirilgan surat")} onClick={() => setSelectedMediaId(null)}>
          <button className="offer-lightbox-close" type="button" aria-label={text("Закрыть", "Yopish")} onClick={() => setSelectedMediaId(null)}>×</button>
          <div className="offer-lightbox-image" onClick={(event) => event.stopPropagation()}>
            <Image src={selectedMedia.url} alt={localized(selectedMedia.title)} fill unoptimized sizes="96vw" />
          </div>
          <p>{localized(selectedMedia.title)}</p>
        </div>
      ) : null}
    </article>
  );
}

"use client";

import Link from "next/link";
import { HomeSearch } from "@/components/home-search";
import { useDemoSession } from "@/components/demo-session";
import { catalogSections, categories, getCategoryById, services } from "@/lib/demo-data";
import { formatMoney } from "@/lib/format";

const quickCategories = categories.filter((category) =>
  ["cat-venue", "cat-photo", "cat-decor", "cat-flowers", "cat-sound-light", "cat-training"].includes(category.id),
);

const featuredServices = services.filter((service) => service.published).slice(0, 4);

export function MobileAppHome() {
  const { state } = useDemoSession();
  const isClient = state.role === "client" || state.role === "client_planner";

  return (
    <div className="mobile-app-home">
      <header className="mobile-app-topbar">
        <Link href="/mobile_app" className="mobile-app-brand" aria-label="Marosim — мобильная главная">
          <span className="brand-mark">M</span>
          <strong>Marosim</strong>
        </Link>
        <Link className="mobile-app-account" href={state.signedIn ? "/account" : "/login?role=client&next=/mobile_app"}>
          {state.signedIn ? "Профиль" : "Войти"}
        </Link>
      </header>

      <section className="mobile-start-card" aria-labelledby="mobile-start-title">
        <p className="mobile-location"><span aria-hidden="true">⌖</span> Узбекистан</p>
        <h1 id="mobile-start-title">Что нужно для события?</h1>
        <p>Найдите услугу, товар или технику и сразу напишите поставщику.</p>
        <HomeSearch variant="mobile" />
      </section>

      <section className="mobile-app-section" aria-labelledby="mobile-sections-title">
        <div className="mobile-section-heading">
          <h2 id="mobile-sections-title">Всё для события</h2>
          <Link href="/catalog">Весь каталог</Link>
        </div>
        <div className="mobile-section-grid">
          {catalogSections.map((section) => (
            <Link href={`/catalog?section=${section.id}`} key={section.id}>
              <span className={`mobile-section-icon mobile-section-icon-${section.id}`} aria-hidden="true">{section.icon}</span>
              <strong>{section.name}</strong>
              <small>{section.id === "services" ? "Найти специалистов" : section.id === "market" ? "Купить для события" : "Арендовать и купить"}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="mobile-app-section" aria-labelledby="mobile-categories-title">
        <div className="mobile-section-heading">
          <h2 id="mobile-categories-title">Популярные категории</h2>
        </div>
        <div className="mobile-category-row">
          {quickCategories.map((category) => (
            <Link href={`/catalog?category=${category.id}`} key={category.id}>
              <span aria-hidden="true">{category.icon}</span>
              <small>{category.name}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="mobile-app-section" aria-labelledby="mobile-featured-title">
        <div className="mobile-section-heading">
          <h2 id="mobile-featured-title">Можно выбрать сейчас</h2>
          <Link href="/catalog">Показать все</Link>
        </div>
        <div className="mobile-offer-row">
          {featuredServices.map((service) => {
            const category = getCategoryById(service.categoryId);
            return (
              <Link className="mobile-offer-card" href={`/catalog?q=${encodeURIComponent(service.title)}`} key={service.id}>
                <span className="mobile-offer-art" aria-hidden="true">{category?.icon ?? "✦"}</span>
                <span className="mobile-offer-copy">
                  <small>{category?.name}</small>
                  <strong>{service.title}</strong>
                  <b>от {formatMoney(service.priceFrom)}</b>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {state.signedIn && isClient ? (
        <section className="mobile-client-tools" aria-labelledby="mobile-tools-title">
          <div>
            <p className="eyebrow">Ваше событие</p>
            <h2 id="mobile-tools-title">Продолжите с того места, где остановились</h2>
          </div>
          <div className="mobile-tool-links">
            <Link href="/saved"><span>♡</span><strong>Сохранённые</strong><small>{state.shortlist.length} предложений</small></Link>
            <Link href="/planner"><span>✓</span><strong>План события</strong><small>Собрать всё по шагам</small></Link>
            <Link href="/chats"><span>↗</span><strong>Сообщения</strong><small>Ответы поставщиков</small></Link>
          </div>
        </section>
      ) : null}

      <section className="mobile-supplier-entry" aria-labelledby="mobile-supplier-title">
        <div>
          <p className="eyebrow">Для поставщиков</p>
          <h2 id="mobile-supplier-title">Предлагаете услуги или товары?</h2>
          <p>Управляйте предложениями и отвечайте клиентам с телефона.</p>
        </div>
        <Link className="button supplier-acquisition-button" href="/mobile_app/supplier">Открыть раздел поставщика</Link>
      </section>
    </div>
  );
}

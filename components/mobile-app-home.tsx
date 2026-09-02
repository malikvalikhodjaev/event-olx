"use client";

import Link from "next/link";
import { HomeSearch } from "@/components/home-search";
import { useDemoSession } from "@/components/demo-session";
import { catalogSections, categories, getCategoryById, services } from "@/lib/demo-data";
import { formatMoney } from "@/lib/format";
import { useLocale } from "@/components/locale-provider";
import { catalogSectionsUz, categoryName } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

const quickCategories = categories.filter((category) =>
  ["cat-venue", "cat-photo", "cat-decor", "cat-flowers", "cat-sound-light", "cat-training"].includes(category.id),
);

const featuredServices = services.filter((service) => service.published).slice(0, 4);

export function MobileAppHome() {
  const { state } = useDemoSession();
  const { locale, text } = useLocale();
  const isClient = state.role === "client" || state.role === "client_planner";

  return (
    <div className="mobile-app-home">
      <header className="mobile-app-topbar">
        <Link href="/mobile_app" className="mobile-app-brand" aria-label={text("Marosim — мобильная главная", "Marosim — mobil bosh sahifa")}>
          <span className="brand-mark">M</span>
          <strong>Marosim</strong>
        </Link>
        <div className="mobile-app-topbar-actions">
          <LanguageSwitcher />
          <Link className="mobile-app-account" href={state.signedIn ? "/account" : "/login?role=client&next=/mobile_app"}>
            {state.signedIn ? text("Профиль", "Profil") : text("Войти", "Kirish")}
          </Link>
        </div>
      </header>

      <section className="mobile-start-card" aria-labelledby="mobile-start-title">
        <p className="mobile-location"><span aria-hidden="true">⌖</span> {text("Узбекистан", "O‘zbekiston")}</p>
        <h1 id="mobile-start-title">{text("Что нужно для события?", "Tadbir uchun nima kerak?")}</h1>
        <p>{text("Найдите услугу, товар или технику и сразу напишите автору предложения.", "Xizmat, mahsulot yoki texnikani toping va e’lon muallifiga darhol yozing.")}</p>
        <HomeSearch variant="mobile" />
      </section>

      <section className="mobile-app-section" aria-labelledby="mobile-sections-title">
        <div className="mobile-section-heading">
          <h2 id="mobile-sections-title">{text("Всё для события", "Tadbir uchun hamma narsa")}</h2>
          <Link href="/catalog">{text("Весь каталог", "Butun katalog")}</Link>
        </div>
        <div className="mobile-section-grid">
          {catalogSections.map((section) => (
            <Link href={`/catalog?section=${section.id}`} key={section.id}>
              <span className={`mobile-section-icon mobile-section-icon-${section.id}`} aria-hidden="true">{section.icon}</span>
              <strong>{locale === "uz" ? catalogSectionsUz[section.id].name : section.name}</strong>
              <small>{section.id === "services" ? text("Найти специалистов", "Mutaxassis topish") : section.id === "market" ? text("Купить для события", "Tadbir uchun sotib olish") : text("Арендовать и купить", "Ijaraga olish va sotib olish")}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="mobile-app-section" aria-labelledby="mobile-categories-title">
        <div className="mobile-section-heading">
          <h2 id="mobile-categories-title">{text("Популярные категории", "Ommabop toifalar")}</h2>
        </div>
        <div className="mobile-category-row">
          {quickCategories.map((category) => (
            <Link href={`/catalog?category=${category.id}`} key={category.id}>
              <span aria-hidden="true">{category.icon}</span>
              <small>{categoryName(locale, category)}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="mobile-app-section" aria-labelledby="mobile-featured-title">
        <div className="mobile-section-heading">
          <h2 id="mobile-featured-title">{text("Можно выбрать сейчас", "Hozir tanlash mumkin")}</h2>
          <Link href="/catalog">{text("Показать все", "Barchasini ko‘rsatish")}</Link>
        </div>
        <div className="mobile-offer-row">
          {featuredServices.map((service) => {
            const category = getCategoryById(service.categoryId);
            return (
              <Link className="mobile-offer-card" href={`/catalog?q=${encodeURIComponent(service.title)}`} key={service.id}>
                <span className="mobile-offer-art" aria-hidden="true">{category?.icon ?? "✦"}</span>
                <span className="mobile-offer-copy">
                  <small>{category ? categoryName(locale, category) : ""}</small>
                  <strong>{service.title}</strong>
                  <b>{text("от", "dan")} {formatMoney(service.priceFrom, locale)}</b>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {state.signedIn && isClient ? (
        <section className="mobile-client-tools" aria-labelledby="mobile-tools-title">
          <div>
            <p className="eyebrow">{text("Ваше событие", "Tadbiringiz")}</p>
            <h2 id="mobile-tools-title">{text("Продолжите с того места, где остановились", "To‘xtagan joyingizdan davom eting")}</h2>
          </div>
          <div className="mobile-tool-links">
            <Link href="/saved"><span>♡</span><strong>{text("Сохранённые", "Saqlanganlar")}</strong><small>{state.shortlist.length} {text("предложений", "taklif")}</small></Link>
            <Link href="/planner"><span>✓</span><strong>{text("План события", "Tadbir rejasi")}</strong><small>{text("Собрать всё по шагам", "Hammasini bosqichma-bosqich yig‘ish")}</small></Link>
            <Link href="/chats"><span>↗</span><strong>{text("Сообщения", "Xabarlar")}</strong><small>{text("Ответы авторов", "Mualliflarning javoblari")}</small></Link>
          </div>
        </section>
      ) : null}

      <section className="mobile-supplier-entry" aria-labelledby="mobile-supplier-title">
        <div>
          <p className="eyebrow">{text("Для авторов предложений", "E’lon mualliflari uchun")}</p>
          <h2 id="mobile-supplier-title">{text("Предлагаете услуги или товары?", "Xizmat yoki mahsulot taklif qilasizmi?")}</h2>
          <p>{text("Управляйте предложениями и отвечайте клиентам с телефона.", "Takliflarni boshqaring va mijozlarga telefondan javob bering.")}</p>
        </div>
        <Link className="button supplier-acquisition-button" href="/mobile_app/supplier">{text("Открыть раздел автора", "Muallif bo‘limini ochish")}</Link>
      </section>
    </div>
  );
}

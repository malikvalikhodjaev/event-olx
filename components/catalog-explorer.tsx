"use client";

import { useMemo, useState } from "react";
import { ServiceCard } from "@/components/service-card";
import { catalogSections, categories, offerKindLabels, services } from "@/lib/demo-data";
import type { CatalogSection, OfferKind } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";
import { catalogSectionsUz, categoryName, categorySearchText, cityName, offerKindLabelsByLocale } from "@/lib/i18n";

type CatalogExplorerProps = {
  initialQuery?: string;
  initialCategory?: string;
  initialSection?: string;
  initialKind?: string;
};

export function CatalogExplorer({ initialQuery = "", initialCategory = "", initialSection = "", initialKind = "" }: CatalogExplorerProps) {
  const { locale, text } = useLocale();
  const initialCategoryDefinition = categories.find((item) => item.id === initialCategory);
  const normalizedInitialSection = catalogSections.some((item) => item.id === initialSection)
    ? initialSection as CatalogSection
    : initialCategoryDefinition?.section ?? "";
  const normalizedInitialKind = Object.hasOwn(offerKindLabels, initialKind) ? initialKind as OfferKind : "";
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [section, setSection] = useState<CatalogSection | "">(normalizedInitialSection);
  const [kind, setKind] = useState<OfferKind | "">(normalizedInitialKind);
  const [city, setCity] = useState("");

  const availableCategories = useMemo(
    () => categories.filter((item) => !section || item.section === section),
    [section],
  );

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    return services.filter((service) => {
      const serviceCategory = categories.find((item) => item.id === service.categoryId);
      const matchesQuery = !normalized || `${service.title} ${service.description} ${categorySearchText(locale, service.categoryId)}`.toLocaleLowerCase(locale === "uz" ? "uz" : "ru").includes(normalized);
      const matchesSection = !section || serviceCategory?.section === section;
      const matchesCategory = !category || service.categoryId === category;
      const matchesKind = !kind || service.offerKind === kind;
      const matchesCity = !city || service.city === city;
      return service.published && matchesQuery && matchesSection && matchesCategory && matchesKind && matchesCity;
    });
  }, [query, section, category, kind, city, locale]);

  const cities = Array.from(new Set(services.map((service) => service.city))).sort();

  return (
    <>
      <div className="catalog-sections" aria-label={text("Разделы каталога", "Katalog bo‘limlari")}>
        <button
          className={`catalog-section-button ${section === "" ? "active" : ""}`}
          type="button"
          aria-pressed={section === ""}
          onClick={() => { setSection(""); setCategory(""); }}
        >
          <span className="category-icon" aria-hidden="true">●</span>
          <span><strong>{text("Всё для события", "Tadbir uchun hamma narsa")}</strong><small>{text("Все предложения", "Barcha takliflar")}</small></span>
        </button>
        {catalogSections.map((item) => (
          <button
            className={`catalog-section-button ${section === item.id ? "active" : ""}`}
            type="button"
            aria-pressed={section === item.id}
            key={item.id}
            onClick={() => { setSection(item.id); setCategory(""); }}
          >
            <span className="category-icon" aria-hidden="true">{item.icon}</span>
            <span><strong>{locale === "uz" ? catalogSectionsUz[item.id].name : item.name}</strong><small>{locale === "uz" ? catalogSectionsUz[item.id].description : item.description}</small></span>
          </button>
        ))}
      </div>
      <div className="filters" aria-label={text("Фильтры каталога", "Katalog filtrlari")}>
        <div className="field">
          <label htmlFor="catalog-query">{text("Что ищете", "Nima izlayapsiz")}</label>
          <input
            id="catalog-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={text("Например, свадебная съёмка", "Masalan, to‘y fotosurati")}
          />
        </div>
        <div className="field">
          <label htmlFor="catalog-category">{text("Категория", "Toifa")}</label>
          <select id="catalog-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">{text("Все категории", "Barcha toifalar")}</option>
            {availableCategories.map((item) => <option key={item.id} value={item.id}>{categoryName(locale, item)}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="catalog-kind">{text("Как получить", "Qanday olish")}</label>
          <select id="catalog-kind" value={kind} onChange={(event) => setKind(event.target.value as OfferKind | "")}>
            <option value="">{text("Любой формат", "Har qanday shakl")}</option>
            {Object.entries(offerKindLabelsByLocale[locale]).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="catalog-city">{text("Город", "Shahar")}</label>
          <select id="catalog-city" value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="">{text("Все города", "Barcha shaharlar")}</option>
            {cities.map((item) => <option key={item} value={item}>{cityName(locale, item)}</option>)}
          </select>
        </div>
      </div>
      <div className="toolbar">
        <strong>{text("Найдено", "Topildi")}: {filtered.length}</strong>
        <span className="small muted">{text("Цену и свободную дату уточняйте у автора предложения", "Narx va bo‘sh sanani e’lon muallifidan aniqlashtiring")}</span>
      </div>
      {filtered.length ? (
        <div className="catalog-results">{filtered.map((service, index) => <ServiceCard key={service.id} service={service} priority={index < 4} />)}</div>
      ) : (
        <div className="empty-state">{text("По этим фильтрам предложений пока нет. Измените раздел, категорию, город или запрос.", "Bu filtrlar bo‘yicha takliflar hozircha yo‘q. Bo‘lim, toifa, shahar yoki so‘rovni o‘zgartiring.")}</div>
      )}
    </>
  );
}

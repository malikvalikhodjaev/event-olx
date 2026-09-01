"use client";

import { useMemo, useState } from "react";
import { ServiceCard } from "@/components/service-card";
import { catalogSections, categories, offerKindLabels, services } from "@/lib/demo-data";
import type { CatalogSection, OfferKind } from "@/lib/types";

type CatalogExplorerProps = {
  initialCategory?: string;
  initialSection?: string;
  initialKind?: string;
};

export function CatalogExplorer({ initialCategory = "", initialSection = "", initialKind = "" }: CatalogExplorerProps) {
  const initialCategoryDefinition = categories.find((item) => item.id === initialCategory);
  const normalizedInitialSection = catalogSections.some((item) => item.id === initialSection)
    ? initialSection as CatalogSection
    : initialCategoryDefinition?.section ?? "";
  const normalizedInitialKind = Object.hasOwn(offerKindLabels, initialKind) ? initialKind as OfferKind : "";
  const [query, setQuery] = useState("");
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
      const matchesQuery = !normalized || `${service.title} ${service.description}`.toLocaleLowerCase("ru").includes(normalized);
      const matchesSection = !section || serviceCategory?.section === section;
      const matchesCategory = !category || service.categoryId === category;
      const matchesKind = !kind || service.offerKind === kind;
      const matchesCity = !city || service.city === city;
      return service.published && matchesQuery && matchesSection && matchesCategory && matchesKind && matchesCity;
    });
  }, [query, section, category, kind, city]);

  const cities = Array.from(new Set(services.map((service) => service.city))).sort();

  return (
    <>
      <div className="catalog-sections" aria-label="Разделы каталога">
        <button
          className={`catalog-section-button ${section === "" ? "active" : ""}`}
          type="button"
          aria-pressed={section === ""}
          onClick={() => { setSection(""); setCategory(""); }}
        >
          <span className="category-icon">●</span>
          <span><strong>Всё для события</strong><small>Все предложения</small></span>
        </button>
        {catalogSections.map((item) => (
          <button
            className={`catalog-section-button ${section === item.id ? "active" : ""}`}
            type="button"
            aria-pressed={section === item.id}
            key={item.id}
            onClick={() => { setSection(item.id); setCategory(""); }}
          >
            <span className="category-icon">{item.icon}</span>
            <span><strong>{item.name}</strong><small>{item.description}</small></span>
          </button>
        ))}
      </div>
      <div className="filters" aria-label="Фильтры каталога">
        <div className="field">
          <label htmlFor="catalog-query">Что ищете</label>
          <input
            id="catalog-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например, свадебная съёмка"
          />
        </div>
        <div className="field">
          <label htmlFor="catalog-category">Категория</label>
          <select id="catalog-category" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">Все категории</option>
            {availableCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="catalog-kind">Как получить</label>
          <select id="catalog-kind" value={kind} onChange={(event) => setKind(event.target.value as OfferKind | "")}>
            <option value="">Любой формат</option>
            {Object.entries(offerKindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="catalog-city">Город</label>
          <select id="catalog-city" value={city} onChange={(event) => setCity(event.target.value)}>
            <option value="">Все города</option>
            {cities.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="toolbar">
        <strong>Найдено: {filtered.length}</strong>
        <span className="small muted">Цену и свободную дату уточняйте у поставщика</span>
      </div>
      {filtered.length ? (
        <div className="grid grid-3">{filtered.map((service) => <ServiceCard key={service.id} service={service} />)}</div>
      ) : (
        <div className="empty-state">По этим фильтрам предложений пока нет. Измените раздел, категорию, город или запрос.</div>
      )}
    </>
  );
}

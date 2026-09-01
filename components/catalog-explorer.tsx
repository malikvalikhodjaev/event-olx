"use client";

import { useMemo, useState } from "react";
import { ServiceCard } from "@/components/service-card";
import { categories, services } from "@/lib/demo-data";

export function CatalogExplorer({ initialCategory = "" }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [city, setCity] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("ru");
    return services.filter((service) => {
      const matchesQuery = !normalized || `${service.title} ${service.description}`.toLocaleLowerCase("ru").includes(normalized);
      const matchesCategory = !category || service.categoryId === category;
      const matchesCity = !city || service.city === city;
      return service.published && matchesQuery && matchesCategory && matchesCity;
    });
  }, [query, category, city]);

  const cities = Array.from(new Set(services.map((service) => service.city))).sort();

  return (
    <>
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
            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
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
        <div className="empty-state">По этим фильтрам услуг пока нет. Измените категорию, город или запрос.</div>
      )}
    </>
  );
}

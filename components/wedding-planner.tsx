"use client";

import { useMemo } from "react";
import { useDemoSession } from "@/components/demo-session";
import { categories, getCategoryById, services } from "@/lib/demo-data";
import { loadDemoState, saveDemoState } from "@/lib/demo-store";
import { formatMoney } from "@/lib/format";
import { useLocale } from "@/components/locale-provider";
import { categoryName, serviceTitle } from "@/lib/i18n";

export function WeddingPlanner() {
  const { state, refresh } = useDemoSession();
  const { locale, text } = useLocale();
  const items = state.plannerItems;
  const doneCount = items.filter((item) => item.done).length;
  const progress = items.length ? Math.round((doneCount / items.length) * 100) : 0;
  const budget = items.reduce((sum, item) => sum + item.budget, 0);

  const serviceOptions = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, services.filter((service) => service.categoryId === category.id)])),
    [],
  );

  function patchItem(categoryId: string, patch: Partial<(typeof items)[number]>) {
    const current = loadDemoState();
    saveDemoState({
      ...current,
      plannerItems: current.plannerItems.map((item) => (item.categoryId === categoryId ? { ...item, ...patch } : item)),
    });
    refresh();
  }

  return (
    <div className="split">
      <section className="panel">
        <div className="toolbar">
          <div>
            <p className="eyebrow">{text("Свадебный чек-лист", "To‘y nazorat ro‘yxati")}</p>
            <h2>{text("Закройте обязательные категории", "Majburiy toifalarni yakunlang")}</h2>
          </div>
          <strong>{doneCount} {text("из", "dan")} {items.length}</strong>
        </div>
        <div className="progress" aria-label={`${text("Готовность", "Tayyorlik")} ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
        <div style={{ marginTop: 16 }}>
          {items.map((item) => {
            const category = getCategoryById(item.categoryId);
            if (!category) return null;
            return (
              <div className="check-row" key={item.categoryId}>
                <input
                  type="checkbox"
                  checked={item.done}
                  aria-label={`${text("Категория", "Toifa")} ${categoryName(locale, category)} ${text("закрыта", "yakunlandi")}`}
                  onChange={(event) => patchItem(item.categoryId, { done: event.target.checked })}
                />
                <div><strong>{category.icon} {categoryName(locale, category)}</strong><br /><span className="small muted">{text("Обязательная категория", "Majburiy toifa")}</span></div>
                <div className="field">
                  <label htmlFor={`service-${category.id}`}>{text("Выбранная услуга", "Tanlangan xizmat")}</label>
                  <select
                    id={`service-${category.id}`}
                    value={item.selectedServiceId ?? ""}
                    onChange={(event) => patchItem(item.categoryId, { selectedServiceId: event.target.value || null, done: Boolean(event.target.value) })}
                  >
                    <option value="">{text("Пока не выбрана", "Hali tanlanmagan")}</option>
                    {(serviceOptions[category.id] ?? []).map((service) => <option key={service.id} value={service.id}>{serviceTitle(locale, service)}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={`budget-${category.id}`}>{text("Бюджет, сум", "Budjet, so‘m")}</label>
                  <input
                    id={`budget-${category.id}`}
                    type="number"
                    min="0"
                    step="100000"
                    value={item.budget || ""}
                    onChange={(event) => patchItem(item.categoryId, { budget: Number(event.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <aside className="panel sticky-panel">
        <p className="eyebrow">{text("Сводка плана", "Reja xulosasi")}</p>
        <h3>{progress === 100 ? text("Базовый план собран", "Asosiy reja tayyor") : text("Есть незакрытые категории", "Yakunlanmagan toifalar bor")}</h3>
        <div className="metric-list">
          <div className="metric"><span>{text("Готовность", "Tayyorlik")}</span><strong>{progress}%</strong></div>
          <div className="metric"><span>{text("Плановый бюджет", "Rejalashtirilgan budjet")}</span><strong>{formatMoney(budget, locale)}</strong></div>
          <div className="metric"><span>{text("Сохранено", "Saqlangan")}</span><strong>{state.shortlist.length}</strong></div>
        </div>
        <div className={`callout ${progress === 100 ? "" : "callout-warning"}`} style={{ marginTop: 16 }}>
          {text("Уточните свободные даты и итоговую цену у выбранных авторов. План сам по себе ничего не бронирует.", "Tanlangan mualliflardan bo‘sh sanalar va yakuniy narxni aniqlashtiring. Rejaning o‘zi hech narsani bron qilmaydi.")}
        </div>
      </aside>
    </div>
  );
}

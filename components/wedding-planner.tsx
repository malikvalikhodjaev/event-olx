"use client";

import { useMemo } from "react";
import { useDemoSession } from "@/components/demo-session";
import { categories, getCategoryById, services } from "@/lib/demo-data";
import { loadDemoState, saveDemoState } from "@/lib/demo-store";
import { formatMoney } from "@/lib/format";

export function WeddingPlanner() {
  const { state, refresh } = useDemoSession();
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
            <p className="eyebrow">Свадебный чек-лист</p>
            <h2>Закройте обязательные категории</h2>
          </div>
          <strong>{doneCount} из {items.length}</strong>
        </div>
        <div className="progress" aria-label={`Готовность ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
        <div style={{ marginTop: 16 }}>
          {items.map((item) => {
            const category = getCategoryById(item.categoryId);
            if (!category) return null;
            return (
              <div className="check-row" key={item.categoryId}>
                <input
                  type="checkbox"
                  checked={item.done}
                  aria-label={`Категория ${category.name} закрыта`}
                  onChange={(event) => patchItem(item.categoryId, { done: event.target.checked })}
                />
                <div><strong>{category.icon} {category.name}</strong><br /><span className="small muted">Обязательная категория</span></div>
                <div className="field">
                  <label htmlFor={`service-${category.id}`}>Выбранная услуга</label>
                  <select
                    id={`service-${category.id}`}
                    value={item.selectedServiceId ?? ""}
                    onChange={(event) => patchItem(item.categoryId, { selectedServiceId: event.target.value || null, done: Boolean(event.target.value) })}
                  >
                    <option value="">Пока не выбрана</option>
                    {(serviceOptions[category.id] ?? []).map((service) => <option key={service.id} value={service.id}>{service.title}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor={`budget-${category.id}`}>Бюджет, сум</label>
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
        <p className="eyebrow">Сводка плана</p>
        <h3>{progress === 100 ? "Базовый план собран" : "Есть незакрытые категории"}</h3>
        <div className="metric-list">
          <div className="metric"><span>Готовность</span><strong>{progress}%</strong></div>
          <div className="metric"><span>Плановый бюджет</span><strong>{formatMoney(budget)}</strong></div>
          <div className="metric"><span>Shortlist</span><strong>{state.shortlist.length}</strong></div>
        </div>
        <div className={`callout ${progress === 100 ? "" : "callout-warning"}`} style={{ marginTop: 16 }}>
          План не подтверждает расходы и не бронирует поставщиков. Конфликты дат и окончательная стоимость проверяются в заявках.
        </div>
      </aside>
    </div>
  );
}

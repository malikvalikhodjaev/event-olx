"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { formatMoney } from "@/lib/format";
import { estimateLineTotal, estimateTotal, validateEstimateDraft } from "@/lib/estimate";
import { priceUnit } from "@/lib/i18n";
import type { EstimateDraft, EstimateLine } from "@/lib/types";

const estimateUnits = ["за услугу", "за гостя", "за человека", "за час", "за день", "за штуку", "за набор", "за комплект", "за килограмм", "за группу", "за проект", "за поездку"];

type EstimateEditorProps = {
  initialDraft: EstimateDraft;
  submitLabel: string;
  onSubmit: (draft: EstimateDraft) => void;
  onCancel?: () => void;
};

export function EstimateEditor({ initialDraft, submitLabel, onSubmit, onCancel }: EstimateEditorProps) {
  const { locale, text } = useLocale();
  const [draft, setDraft] = useState<EstimateDraft>(() => ({
    ...initialDraft,
    lines: initialDraft.lines.map((line) => ({ ...line })),
  }));
  const [error, setError] = useState("");

  function updateLine(id: string, patch: Partial<EstimateLine>) {
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) => line.id === id ? { ...line, ...patch } : line),
    }));
  }

  function changeGuestCount(value: number) {
    setDraft((current) => ({
      ...current,
      guestCount: value,
      lines: current.lines.map((line) => line.unit === "за гостя" ? { ...line, quantity: value } : line),
    }));
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateEstimateDraft(draft);
    if (validationErrors.length) {
      setError(text("Заполните дату, город, количество гостей и все строки расчёта.", "Sana, shahar, mehmonlar soni va hisob-kitobning barcha qatorlarini to‘ldiring."));
      return;
    }
    setError("");
    onSubmit(draft);
  }

  return (
    <form className="estimate-editor" onSubmit={submit}>
      <div className="estimate-event-fields">
        <div className="field">
          <label htmlFor="estimate-date">{text("Дата события", "Tadbir sanasi")}</label>
          <input id="estimate-date" type="date" value={draft.eventDate} onChange={(event) => setDraft((current) => ({ ...current, eventDate: event.target.value }))} required />
        </div>
        <div className="field">
          <label htmlFor="estimate-city">{text("Город", "Shahar")}</label>
          <input id="estimate-city" value={draft.city} onChange={(event) => setDraft((current) => ({ ...current, city: event.target.value }))} required />
        </div>
        <div className="field">
          <label htmlFor="estimate-guests">{text("Количество людей", "Odamlar soni")}</label>
          <input id="estimate-guests" type="number" min="1" max="10000" step="1" value={draft.guestCount || ""} onChange={(event) => changeGuestCount(Number(event.target.value))} required />
        </div>
      </div>

      <div className="table-wrap estimate-table-wrap">
        <table className="estimate-table">
          <thead>
            <tr>
              <th>{text("Позиция", "Pozitsiya")}</th>
              <th>{text("Количество", "Miqdor")}</th>
              <th>{text("Единица", "Birlik")}</th>
              <th>{text("Цена", "Narx")}</th>
              <th>{text("Сумма", "Jami")}</th>
              <th><span className="sr-only">{text("Действия", "Amallar")}</span></th>
            </tr>
          </thead>
          <tbody>
            {draft.lines.map((line, index) => (
              <tr key={line.id}>
                <td><input aria-label={`${text("Позиция", "Pozitsiya")} ${index + 1}`} value={line.title} onChange={(event) => updateLine(line.id, { title: event.target.value })} required /></td>
                <td><input aria-label={`${text("Количество", "Miqdor")} ${index + 1}`} type="number" min="0.01" step="0.01" value={line.quantity || ""} onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) })} required /></td>
                <td><select aria-label={`${text("Единица", "Birlik")} ${index + 1}`} value={line.unit} onChange={(event) => updateLine(line.id, { unit: event.target.value })}>{!estimateUnits.includes(line.unit) ? <option value={line.unit}>{line.unit}</option> : null}{estimateUnits.map((unit) => <option value={unit} key={unit}>{priceUnit(locale, unit)}</option>)}</select></td>
                <td><input aria-label={`${text("Цена", "Narx")} ${index + 1}`} type="number" min="0" step="1000" value={line.unitPrice} onChange={(event) => updateLine(line.id, { unitPrice: Number(event.target.value) })} required /></td>
                <td><strong>{formatMoney(estimateLineTotal(line), locale)}</strong></td>
                <td><button className="estimate-remove" type="button" aria-label={`${text("Удалить строку", "Qatorni o‘chirish")} ${index + 1}`} disabled={draft.lines.length === 1} onClick={() => setDraft((current) => ({ ...current, lines: current.lines.filter((item) => item.id !== line.id) }))}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="button button-secondary button-small"
        type="button"
        onClick={() => setDraft((current) => ({
          ...current,
          lines: [
            ...current.lines,
            {
              id: crypto.randomUUID(),
              title: text("Дополнительная позиция", "Qo‘shimcha pozitsiya"),
              quantity: 1,
              unit: "за услугу",
              unitPrice: 0,
            },
          ],
        }))}
      >
        + {text("Добавить строку", "Qator qo‘shish")}
      </button>

      <div className="field estimate-note-field">
        <label htmlFor="estimate-note">{text("Комментарий", "Izoh")}</label>
        <textarea id="estimate-note" rows={3} maxLength={1500} value={draft.note} onChange={(event) => setDraft((current) => ({ ...current, note: event.target.value }))} placeholder={text("Например: нужен детский стол и место для церемонии", "Masalan: bolalar stoli va marosim uchun joy kerak")} />
      </div>

      <div className="estimate-editor-footer">
        <div><span>{text("Предварительный итог", "Dastlabki jami")}</span><strong>{formatMoney(estimateTotal(draft.lines), locale)}</strong></div>
        <div className="actions">
          {onCancel ? <button className="button button-secondary" type="button" onClick={onCancel}>{text("Отмена", "Bekor qilish")}</button> : null}
          <button className="button button-primary" type="submit">{submitLabel}</button>
        </div>
      </div>
      {error ? <p className="error-text" role="alert">{error}</p> : null}
      <p className="small muted">{text("Предварительный расчёт не является бронью, договором или подтверждением окончательной цены.", "Dastlabki hisob-kitob bron, shartnoma yoki yakuniy narx tasdig‘i hisoblanmaydi.")}</p>
    </form>
  );
}

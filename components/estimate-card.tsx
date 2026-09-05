"use client";

import { useLocale } from "@/components/locale-provider";
import { formatDateTime, formatMoney } from "@/lib/format";
import { estimateLineTotal } from "@/lib/estimate";
import { priceUnit } from "@/lib/i18n";
import type { EstimateRevision } from "@/lib/types";

export function EstimateCard({ revision, canRecalculate, onRecalculate }: { revision: EstimateRevision; canRecalculate: boolean; onRecalculate?: () => void }) {
  const { locale, text } = useLocale();
  return (
    <article className="estimate-card" data-testid={`estimate-version-${revision.version}`}>
      <header>
        <div>
          <p className="eyebrow">{revision.sender === "supplier" ? text("Расчёт автора", "Muallif hisobi") : text("Запрос клиента", "Mijoz so‘rovi")}</p>
          <h3>{text("Расчёт", "Hisob-kitob")} v{revision.version}</h3>
        </div>
        <time>{formatDateTime(revision.createdAt, locale)}</time>
      </header>
      <dl className="estimate-summary">
        <div><dt>{text("Дата", "Sana")}</dt><dd>{new Intl.DateTimeFormat(locale === "uz" ? "uz-UZ" : "ru-RU", { dateStyle: "medium" }).format(new Date(`${revision.eventDate}T12:00:00`))}</dd></div>
        <div><dt>{text("Город", "Shahar")}</dt><dd>{revision.city}</dd></div>
        <div><dt>{text("Людей", "Odamlar")}</dt><dd>{revision.guestCount}</dd></div>
      </dl>
      <div className="table-wrap">
        <table className="estimate-card-table">
          <thead><tr><th>{text("Позиция", "Pozitsiya")}</th><th>{text("Кол-во", "Miqdor")}</th><th>{text("Цена", "Narx")}</th><th>{text("Сумма", "Jami")}</th></tr></thead>
          <tbody>{revision.lines.map((line) => <tr key={line.id}><td>{line.title}<small>{priceUnit(locale, line.unit)}</small></td><td>{line.quantity}</td><td>{formatMoney(line.unitPrice, locale)}</td><td>{formatMoney(estimateLineTotal(line), locale)}</td></tr>)}</tbody>
          <tfoot><tr><td colSpan={3}>{text("Итого", "Jami")}</td><td>{formatMoney(revision.total, locale)}</td></tr></tfoot>
        </table>
      </div>
      {revision.note ? <p className="estimate-card-note"><strong>{text("Комментарий", "Izoh")}:</strong> {revision.note}</p> : null}
      <p className="estimate-disclaimer">{text("Предварительно · не бронь и не договор", "Dastlabki · bron yoki shartnoma emas")}</p>
      {canRecalculate && onRecalculate ? <button className="button button-secondary button-small" type="button" onClick={onRecalculate}>{text("Пересчитать", "Qayta hisoblash")}</button> : null}
    </article>
  );
}

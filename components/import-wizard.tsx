"use client";

import { useState } from "react";
import ExcelJS from "exceljs";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { addImportedServices } from "@/lib/demo-store";
import { importRowsToDraftServices, requiredTemplateHeaders, validateImportRecord } from "@/lib/import-validation";
import type { ImportServiceRow, OfferKind } from "@/lib/types";
import { useLocale } from "@/components/locale-provider";
import { offerKindLabelsByLocale } from "@/lib/i18n";

export function ImportWizard() {
  const { refresh } = useDemoSession();
  const { locale, text } = useLocale();
  const [rows, setRows] = useState<ImportServiceRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const validRows = rows.filter((row) => row.errors.length === 0);

  async function readFile(file: File) {
    setMessage("");
    setFileName(file.name);
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(await file.arrayBuffer());
      const sheet = workbook.worksheets[0];
      if (!sheet) throw new Error(text("В книге нет листов", "Faylda varaqlar yo‘q"));
      const headers = sheet.getRow(1).values as unknown[];
      const headerMap = new Map<number, string>();
      headers.forEach((value, index) => {
        const name = String(value ?? "").trim().toLowerCase();
        if (name) headerMap.set(index, name);
      });
      const missing = requiredTemplateHeaders.filter((header) => !Array.from(headerMap.values()).includes(header));
      if (missing.length) throw new Error(`${text("Не найдены колонки", "Ustunlar topilmadi")}: ${missing.join(", ")}`);
      const parsed: ImportServiceRow[] = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const record: Record<string, unknown> = {};
        headerMap.forEach((header, column) => { record[header] = row.getCell(column).value; });
        if (Object.values(record).every((value) => value === null || value === "")) return;
        parsed.push(validateImportRecord(record, rowNumber));
      });
      setRows(parsed);
      if (!parsed.length) setMessage(text("В файле нет предложений.", "Faylda takliflar yo‘q."));
    } catch (error) {
      setRows([]);
      setMessage(error instanceof Error ? error.message : text("Не удалось прочитать Excel-файл", "Excel faylini o‘qib bo‘lmadi"));
    }
  }

  function importDrafts() {
    const drafts = importRowsToDraftServices(validRows, "supplier-silk-road");
    addImportedServices(drafts);
    refresh();
    setMessage(locale === "uz" ? `${drafts.length} ta taklif qo‘shildi. Hozircha ularni faqat siz ko‘rasiz.` : `Добавлено предложений: ${drafts.length}. Пока их видите только вы.`);
    setRows([]);
    setFileName("");
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">{text("Шаг 1", "1-qadam")}</p><h2>{text("Скачайте шаблон", "Shablonni yuklab oling")}</h2></div><a className="button button-secondary" href="/api/templates/services">{text("Скачать шаблон Excel", "Excel shablonini yuklash")}</a></div>
        <p className="muted">{text("В шаблоне есть подсказки, списки значений и примеры услуги, товара и аренды. Замените примеры своими предложениями.", "Shablonda ko‘rsatmalar, qiymatlar ro‘yxati va xizmat, mahsulot hamda ijara misollari bor. Misollarni o‘z takliflaringiz bilan almashtiring.")}</p>
      </section>
      <section className="panel">
        <p className="eyebrow">{text("Шаг 2", "2-qadam")}</p><h2>{text("Загрузите и проверьте файл", "Faylni yuklang va tekshiring")}</h2>
        <div className="field"><label htmlFor="price-file">{text("Файл Excel, до 2 МБ", "Excel fayli, 2 MB gacha")}</label><input id="price-file" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file); }} /></div>
        {fileName ? <p className="small muted" style={{ marginTop: 10 }}>{text("Файл", "Fayl")}: {fileName}</p> : null}
        {message ? <div className="callout" style={{ marginTop: 14 }}>{message}</div> : null}
      </section>
      {rows.length ? <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">{text("Шаг 3", "3-qadam")}</p><h2>{text("Проверьте предложения", "Takliflarni tekshiring")}</h2></div><div className="badge-row"><StatusBadge tone="success">{text("Готово", "Tayyor")}: {validRows.length}</StatusBadge><StatusBadge tone={rows.length === validRows.length ? "success" : "danger"}>{text("Нужно исправить", "Tuzatish kerak")}: {rows.length - validRows.length}</StatusBadge></div></div>
        <div className="table-wrap"><table><thead><tr><th>{text("Строка", "Qator")}</th><th>{text("Предложение", "Taklif")}</th><th>{text("Категория", "Toifa")}</th><th>{text("Формат", "Shakl")}</th><th>{text("Город", "Shahar")}</th><th>{text("Цена", "Narx")}</th><th>{text("Результат", "Natija")}</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.rowNumber}-${row.externalId}`}><td>{row.rowNumber}</td><td>{row.title || "—"}</td><td>{row.category || "—"}</td><td>{offerKindLabelsByLocale[locale][row.offerKind as OfferKind] ?? row.offerKind}</td><td>{row.city || "—"}</td><td>{row.priceFrom ?? "—"} · {row.priceUnit}</td><td>{row.errors.length ? <span className="error-text">{row.errors.join("; ")}</span> : <StatusBadge tone="success">{text("Готово", "Tayyor")}</StatusBadge>}</td></tr>)}</tbody></table></div>
        <div className="callout callout-warning" style={{ marginTop: 16 }}>{text("Строки с ошибками не будут добавлены. Остальные предложения сохранятся как неопубликованные.", "Xatoli qatorlar qo‘shilmaydi. Qolgan takliflar e’lon qilinmagan holda saqlanadi.")}</div>
        <button className="button button-primary" style={{ marginTop: 16 }} disabled={!validRows.length} onClick={importDrafts}>{text("Добавить предложения", "Takliflarni qo‘shish")}: {validRows.length}</button>
      </section> : null}
    </div>
  );
}

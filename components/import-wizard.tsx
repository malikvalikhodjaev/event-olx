"use client";

import { useState } from "react";
import ExcelJS from "exceljs";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { addImportedServices } from "@/lib/demo-store";
import { offerKindLabels } from "@/lib/demo-data";
import { importRowsToDraftServices, requiredTemplateHeaders, validateImportRecord } from "@/lib/import-validation";
import type { ImportServiceRow, OfferKind } from "@/lib/types";

export function ImportWizard() {
  const { refresh } = useDemoSession();
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
      if (!sheet) throw new Error("В книге нет листов");
      const headers = sheet.getRow(1).values as unknown[];
      const headerMap = new Map<number, string>();
      headers.forEach((value, index) => {
        const name = String(value ?? "").trim().toLowerCase();
        if (name) headerMap.set(index, name);
      });
      const missing = requiredTemplateHeaders.filter((header) => !Array.from(headerMap.values()).includes(header));
      if (missing.length) throw new Error(`Не найдены колонки: ${missing.join(", ")}`);
      const parsed: ImportServiceRow[] = [];
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const record: Record<string, unknown> = {};
        headerMap.forEach((header, column) => { record[header] = row.getCell(column).value; });
        if (Object.values(record).every((value) => value === null || value === "")) return;
        parsed.push(validateImportRecord(record, rowNumber));
      });
      setRows(parsed);
      if (!parsed.length) setMessage("В файле нет предложений.");
    } catch (error) {
      setRows([]);
      setMessage(error instanceof Error ? error.message : "Не удалось прочитать Excel-файл");
    }
  }

  function importDrafts() {
    const drafts = importRowsToDraftServices(validRows, "supplier-silk-road");
    addImportedServices(drafts);
    refresh();
    setMessage(`Добавлено предложений: ${drafts.length}. Пока их видите только вы.`);
    setRows([]);
    setFileName("");
  }

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Шаг 1</p><h2>Скачайте шаблон</h2></div><a className="button button-secondary" href="/api/templates/services">Скачать шаблон Excel</a></div>
        <p className="muted">В шаблоне есть подсказки, списки значений и примеры услуги, товара и аренды. Замените примеры своими предложениями.</p>
      </section>
      <section className="panel">
        <p className="eyebrow">Шаг 2</p><h2>Загрузите и проверьте файл</h2>
        <div className="field"><label htmlFor="price-file">Файл Excel, до 2 МБ</label><input id="price-file" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(event) => { const file = event.target.files?.[0]; if (file) void readFile(file); }} /></div>
        {fileName ? <p className="small muted" style={{ marginTop: 10 }}>Файл: {fileName}</p> : null}
        {message ? <div className="callout" style={{ marginTop: 14 }}>{message}</div> : null}
      </section>
      {rows.length ? <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">Шаг 3</p><h2>Проверьте предложения</h2></div><div className="badge-row"><StatusBadge tone="success">Готово: {validRows.length}</StatusBadge><StatusBadge tone={rows.length === validRows.length ? "success" : "danger"}>Нужно исправить: {rows.length - validRows.length}</StatusBadge></div></div>
        <div className="table-wrap"><table><thead><tr><th>Строка</th><th>Предложение</th><th>Категория</th><th>Формат</th><th>Город</th><th>Цена</th><th>Результат</th></tr></thead><tbody>{rows.map((row) => <tr key={`${row.rowNumber}-${row.externalId}`}><td>{row.rowNumber}</td><td>{row.title || "—"}</td><td>{row.category || "—"}</td><td>{offerKindLabels[row.offerKind as OfferKind] ?? row.offerKind}</td><td>{row.city || "—"}</td><td>{row.priceFrom ?? "—"} · {row.priceUnit}</td><td>{row.errors.length ? <span className="error-text">{row.errors.join("; ")}</span> : <StatusBadge tone="success">Готово</StatusBadge>}</td></tr>)}</tbody></table></div>
        <div className="callout callout-warning" style={{ marginTop: 16 }}>Строки с ошибками не будут добавлены. Остальные предложения сохранятся как неопубликованные.</div>
        <button className="button button-primary" style={{ marginTop: 16 }} disabled={!validRows.length} onClick={importDrafts}>Добавить предложения: {validRows.length}</button>
      </section> : null}
    </div>
  );
}

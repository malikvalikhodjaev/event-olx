import ExcelJS from "exceljs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Marosim";
  workbook.created = new Date("2026-09-01T00:00:00Z");
  const sheet = workbook.addWorksheet("Услуги", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "external_id", key: "external_id", width: 18 },
    { header: "title", key: "title", width: 34 },
    { header: "category", key: "category", width: 20 },
    { header: "city", key: "city", width: 18 },
    { header: "description", key: "description", width: 54 },
    { header: "price_from", key: "price_from", width: 18 },
    { header: "price_unit", key: "price_unit", width: 18 },
    { header: "availability", key: "availability", width: 18 },
  ];
  sheet.addRows([
    { external_id: "SR-001", title: "Банкетный зал на 120 гостей", category: "venue", city: "Ташкент", description: "Зал, мебель, сцена и парковка на один день.", price_from: 18000000, price_unit: "за день", availability: "по запросу" },
    { external_id: "SR-002", title: "Свадебный кейтеринг", category: "catering", city: "Ташкент", description: "Меню, обслуживание гостей и базовая сервировка.", price_from: 240000, price_unit: "за гостя", availability: "доступно" },
  ]);
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF12604A" } };
  sheet.autoFilter = { from: "A1", to: "H3" };
  sheet.getColumn("price_from").numFmt = "#,##0";

  const reference = workbook.addWorksheet("Справочники");
  reference.columns = [{ header: "category", width: 22 }, { header: "Название", width: 30 }, { header: "price_unit", width: 20 }, { header: "availability", width: 20 }];
  const categories = [["venue", "Площадка"], ["catering", "Кейтеринг"], ["photo-video", "Фото и видео"], ["decor", "Декор и флористика"], ["host", "Ведущий"], ["music", "Музыка и DJ"], ["transport", "Транспорт"], ["training", "Тренинги и тимбилдинг"]];
  categories.forEach((category, index) => reference.addRow([category[0], category[1], ["за услугу", "за час", "за гостя", "за день"][index] ?? "", ["доступно", "по запросу", "недоступно"][index] ?? ""]));
  reference.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(Buffer.from(buffer), { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=marosim-services-template.xlsx", "Cache-Control": "public, max-age=3600" } });
}

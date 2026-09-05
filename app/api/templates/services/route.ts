import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { catalogSections, categories, offerKindLabels } from "@/lib/demo-data";
import type { OfferKind, PriceUnit } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Marosim";
  workbook.created = new Date("2026-09-01T00:00:00Z");
  const sheet = workbook.addWorksheet("Предложения", { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = [
    { header: "external_id", key: "external_id", width: 18 },
    { header: "title_ru", key: "title_ru", width: 34 },
    { header: "title_uz", key: "title_uz", width: 34 },
    { header: "category", key: "category", width: 20 },
    { header: "offer_kind", key: "offer_kind", width: 18 },
    { header: "city", key: "city", width: 18 },
    { header: "description_ru", key: "description_ru", width: 54 },
    { header: "description_uz", key: "description_uz", width: 54 },
    { header: "price_from", key: "price_from", width: 18 },
    { header: "price_unit", key: "price_unit", width: 18 },
    { header: "availability", key: "availability", width: 18 },
  ];
  sheet.addRows([
    { external_id: "SR-001", title_ru: "Банкетный зал на 120 гостей", title_uz: "120 mehmon uchun banket zali", category: "venue", offer_kind: "service", city: "Ташкент", description_ru: "Зал, мебель, сцена и парковка на один день.", description_uz: "Zal, mebel, sahna va bir kunlik avtoturargoh.", price_from: 18000000, price_unit: "за день", availability: "по запросу" },
    { external_id: "GM-001", title_ru: "Свадебный букет", title_uz: "To‘y guldastasi", category: "flowers", offer_kind: "sale", city: "Ташкент", description_ru: "Букет в выбранной гамме, лента и упаковка.", description_uz: "Tanlangan ranglardagi guldasta, lenta va o‘ram.", price_from: 650000, price_unit: "за штуку", availability: "доступно" },
    { external_id: "OT-001", title_ru: "Комплект звука и света", title_uz: "Ovoz va yorug‘lik to‘plami", category: "sound-light", offer_kind: "rental", city: "Ташкент", description_ru: "Оборудование, доставка и настройка перед событием.", description_uz: "Uskuna, yetkazib berish va tadbir oldidan sozlash.", price_from: 4500000, price_unit: "за день", availability: "по запросу" },
  ]);
  sheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF12604A" } };
  sheet.autoFilter = { from: "A1", to: "K4" };
  sheet.getColumn("price_from").numFmt = "#,##0";

  const lastCategoryRow = categories.length + 1;
  for (let row = 2; row <= 500; row += 1) {
    sheet.getCell(`D${row}`).dataValidation = { type: "list", allowBlank: false, formulae: [`Справочники!$A$2:$A$${lastCategoryRow}`] };
    sheet.getCell(`E${row}`).dataValidation = { type: "list", allowBlank: false, formulae: ['"service,sale,rental"'] };
    sheet.getCell(`J${row}`).dataValidation = { type: "list", allowBlank: false, formulae: ['"за услугу,за час,за гостя,за день,за штуку,за набор,за комплект,за килограмм"'] };
    sheet.getCell(`K${row}`).dataValidation = { type: "list", allowBlank: false, formulae: ['"доступно,по запросу,недоступно"'] };
  }

  const headerNotes: Record<string, string> = {
    A1: "Ваш постоянный уникальный код предложения.",
    B1: "Название на русском языке. Обязательное поле, до 80 символов.",
    C1: "Название на узбекском языке. Обязательное поле, до 80 символов.",
    D1: "Выберите код категории из листа «Справочники».",
    E1: "service — услуга, sale — покупка, rental — аренда.",
    G1: "Короткое описание на русском: от 10 до 120 символов.",
    H1: "Короткое описание на узбекском: от 10 до 120 символов.",
    I1: "Цена только числом, без пробелов и обозначения валюты.",
  };
  Object.entries(headerNotes).forEach(([cell, note]) => { sheet.getCell(cell).note = note; });

  const reference = workbook.addWorksheet("Справочники");
  reference.columns = [
    { header: "category", width: 22 },
    { header: "Название", width: 32 },
    { header: "Раздел", width: 18 },
    { header: "offer_kind", width: 18 },
    { header: "Формат", width: 18 },
    { header: "price_unit", width: 20 },
    { header: "availability", width: 20 },
  ];
  const offerKinds = Object.keys(offerKindLabels) as OfferKind[];
  const priceUnits: PriceUnit[] = ["за услугу", "за час", "за гостя", "за день", "за штуку", "за набор", "за комплект", "за килограмм"];
  const availability = ["доступно", "по запросу", "недоступно"];
  categories.forEach((category, index) => {
    reference.addRow([
      category.slug,
      category.name,
      catalogSections.find((section) => section.id === category.section)?.name ?? category.section,
      offerKinds[index] ?? "",
      offerKinds[index] ? offerKindLabels[offerKinds[index]] : "",
      priceUnits[index] ?? "",
      availability[index] ?? "",
    ]);
  });
  reference.getRow(1).font = { bold: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return new NextResponse(Buffer.from(buffer), { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=marosim-offers-template.xlsx", "Cache-Control": "public, max-age=3600" } });
}

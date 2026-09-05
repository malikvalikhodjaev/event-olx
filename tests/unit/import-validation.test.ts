import { describe, expect, it } from "vitest";
import { importRowsToDraftServices, validateImportRecord } from "@/lib/import-validation";

describe("Excel import validation", () => {
  it("нормализует корректную строку и создает только черновик", () => {
    const row = validateImportRecord({ external_id: "SR-101", title_ru: "Зал для свадьбы", title_uz: "To‘y uchun zal", category: "venue", city: "Ташкент", description_ru: "Зал с мебелью и парковкой на один день.", description_uz: "Mebel va avtoturargohli bir kunlik to‘y zali.", price_from: 18000000, price_unit: "за день", availability: "доступно" }, 2);
    expect(row.errors).toEqual([]);
    const [service] = importRowsToDraftServices([row], "supplier-silk-road");
    expect(service).toMatchObject({ published: false, active: true, categoryId: "cat-venue", offerKind: "service", titleUz: "To‘y uchun zal" });
  });

  it("распознаёт товар из раздела Маркет", () => {
    const row = validateImportRecord({ external_id: "GM-101", title_ru: "Набор свечей", title_uz: "Shamlar to‘plami", category: "event-details", offer_kind: "sale", city: "Ташкент", description_ru: "Свечи и подсвечники для пяти гостевых столов.", description_uz: "Beshta mehmon stoli uchun sham va shamdonlar.", price_from: 480000, price_unit: "за набор", availability: "доступно" }, 2);
    expect(row.errors).toEqual([]);
    const [service] = importRowsToDraftServices([row], "supplier-gulzor");
    expect(service).toMatchObject({ categoryId: "cat-event-details", offerKind: "sale", priceUnit: "за набор" });
  });

  it("возвращает все ошибки строки до записи", () => {
    const row = validateImportRecord({ external_id: "", title_ru: "", title_uz: "", category: "unknown", city: "", description_ru: "кратко", description_uz: "qisqa", price_from: -1, price_unit: "за метр", availability: "когда-нибудь" }, 8);
    expect(row.errors.length).toBe(10);
    expect(row.rowNumber).toBe(8);
  });
});

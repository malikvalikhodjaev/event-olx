import { describe, expect, it } from "vitest";
import { importRowsToDraftServices, validateImportRecord } from "@/lib/import-validation";

describe("Excel import validation", () => {
  it("нормализует корректную строку и создает только черновик", () => {
    const row = validateImportRecord({ external_id: "SR-101", title: "Зал для свадьбы", category: "venue", city: "Ташкент", description: "Зал с мебелью и парковкой на один день.", price_from: 18000000, price_unit: "за день", availability: "доступно" }, 2);
    expect(row.errors).toEqual([]);
    const [service] = importRowsToDraftServices([row], "supplier-silk-road");
    expect(service).toMatchObject({ published: false, active: true, categoryId: "cat-venue" });
  });

  it("возвращает все ошибки строки до записи", () => {
    const row = validateImportRecord({ external_id: "", title: "", category: "unknown", city: "", description: "кратко", price_from: -1, price_unit: "за метр", availability: "когда-нибудь" }, 8);
    expect(row.errors.length).toBe(8);
    expect(row.rowNumber).toBe(8);
  });
});

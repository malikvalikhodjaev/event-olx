import { categories } from "@/lib/demo-data";
import type { ImportServiceRow, PriceUnit, Service } from "@/lib/types";

export const templateHeaders = [
  "external_id",
  "title",
  "category",
  "city",
  "description",
  "price_from",
  "price_unit",
  "availability",
] as const;

const priceUnits: PriceUnit[] = ["за услугу", "за час", "за гостя", "за день"];

function cellText(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && value && "text" in value) return String((value as { text: unknown }).text).trim();
  if (typeof value === "object" && value && "result" in value) return String((value as { result: unknown }).result ?? "").trim();
  return String(value).trim();
}

export function validateImportRecord(record: Record<string, unknown>, rowNumber: number): ImportServiceRow {
  const externalId = cellText(record.external_id);
  const title = cellText(record.title);
  const category = cellText(record.category);
  const city = cellText(record.city);
  const description = cellText(record.description);
  const rawPrice = cellText(record.price_from).replace(/\s/g, "").replace(",", ".");
  const priceFrom = rawPrice === "" ? null : Number(rawPrice);
  const priceUnit = cellText(record.price_unit).toLowerCase();
  const availability = cellText(record.availability).toLowerCase();
  const errors: string[] = [];

  if (!externalId) errors.push("external_id обязателен");
  if (!title) errors.push("title обязателен");
  if (!categories.some((item) => item.slug === category || item.name.toLowerCase() === category.toLowerCase())) {
    errors.push("category не найдена в справочнике");
  }
  if (!city) errors.push("city обязателен");
  if (description.length < 10) errors.push("description: минимум 10 символов");
  if (priceFrom === null || !Number.isFinite(priceFrom) || priceFrom < 0) errors.push("price_from должен быть числом ≥ 0");
  if (!priceUnits.includes(priceUnit as PriceUnit)) errors.push(`price_unit: ${priceUnits.join(", ")}`);
  if (!["доступно", "по запросу", "недоступно"].includes(availability)) errors.push("availability: доступно, по запросу или недоступно");

  return { rowNumber, externalId, title, category, city, description, priceFrom, priceUnit, availability, errors };
}

export function importRowsToDraftServices(rows: ImportServiceRow[], supplierId: string): Service[] {
  const now = new Date().toISOString();
  return rows.filter((row) => row.errors.length === 0).map((row) => {
    const category = categories.find((item) => item.slug === row.category || item.name.toLowerCase() === row.category.toLowerCase());
    return {
      id: `import-${row.externalId}-${crypto.randomUUID()}`,
      supplierId,
      categoryId: category?.id ?? "cat-venue",
      title: row.title,
      description: row.description,
      city: row.city,
      priceFrom: row.priceFrom ?? 0,
      priceUnit: row.priceUnit as PriceUnit,
      active: row.availability !== "недоступно",
      published: false,
      updatedAt: now,
      availabilityConfirmedAt: row.availability === "доступно" ? now : null,
    };
  });
}

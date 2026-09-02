import { categories } from "@/lib/demo-data";
import type { ImportServiceRow, OfferKind, PriceUnit, Service } from "@/lib/types";

export const templateHeaders = [
  "external_id",
  "title",
  "category",
  "offer_kind",
  "city",
  "description",
  "price_from",
  "price_unit",
  "availability",
] as const;

export const requiredTemplateHeaders = templateHeaders.filter((header) => header !== "offer_kind");

const priceUnits: PriceUnit[] = ["за услугу", "за час", "за гостя", "за день", "за штуку", "за набор", "за комплект", "за килограмм"];
const offerKinds: OfferKind[] = ["service", "sale", "rental"];

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
  const offerKind = cellText(record.offer_kind).toLowerCase() || "service";
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
  if (!offerKinds.includes(offerKind as OfferKind)) errors.push("offer_kind: service, sale или rental");
  if (!["доступно", "по запросу", "недоступно"].includes(availability)) errors.push("availability: доступно, по запросу или недоступно");

  return { rowNumber, externalId, title, category, city, description, priceFrom, priceUnit, offerKind, availability, errors };
}

export function importRowsToDraftServices(rows: ImportServiceRow[], supplierId: string): Service[] {
  const now = new Date().toISOString();
  return rows.filter((row) => row.errors.length === 0).map((row) => {
    const category = categories.find((item) => item.slug === row.category || item.name.toLowerCase() === row.category.toLowerCase());
    const sectionImage = category?.section === "market"
      ? "/catalog-market-v1.png"
      : category?.section === "equipment"
        ? "/catalog-equipment-v1.png"
        : "/catalog-services-v1.png";
    return {
      id: `import-${row.externalId}-${crypto.randomUUID()}`,
      sku: row.externalId,
      supplierId,
      categoryId: category?.id ?? "cat-venue",
      title: row.title,
      description: row.description,
      city: row.city,
      priceFrom: row.priceFrom ?? 0,
      priceUnit: row.priceUnit as PriceUnit,
      offerKind: row.offerKind as OfferKind,
      imageUrl: sectionImage,
      active: row.availability !== "недоступно",
      published: false,
      updatedAt: now,
      availabilityConfirmedAt: row.availability === "доступно" ? now : null,
    };
  });
}

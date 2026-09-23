import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { categories, services, suppliers } from "@/lib/demo-data";

describe("стартовый каталог", () => {
  it("содержит 132 опубликованных SKU с уникальными кодами", () => {
    expect(services).toHaveLength(132);
    expect(new Set(services.map((service) => service.id)).size).toBe(132);
    expect(new Set(services.map((service) => service.sku)).size).toBe(132);
    expect(services.every((service) => service.active && service.published)).toBe(true);
    expect(services.filter((service) => service.sourcePlatform === "olx")).toHaveLength(95);
    expect(services.filter((service) => service.sourcePlatform === "web")).toHaveLength(5);
    expect(services.filter((service) => service.sourcePlatform === "telegram")).toHaveLength(32);
    expect(suppliers).toHaveLength(119);
    expect(services.filter((service) => service.categoryId === "cat-venue" && service.sourcePlatform === "telegram")).toHaveLength(7);
  });

  it("покрывает основные разделы и показывает уникальные фотографии объявлений", () => {
    for (const section of ["services", "market", "equipment"]) {
      expect(services.some((service) => categories.some((category) => category.id === service.categoryId && category.section === section))).toBe(true);
    }
    expect(new Set(services.map((service) => service.imageUrl)).size).toBe(132);
  });

  it("связывает каждый SKU с источником, автором и локальной фотографией без выдуманной проверки", () => {
    for (const service of services) {
      expect(categories.some((category) => category.id === service.categoryId)).toBe(true);
      const supplier = suppliers.find((item) => item.id === service.supplierId);
      expect(supplier).toBeDefined();
      expect(supplier?.profileStatus).toBe("unclaimed");
      expect(supplier?.verified).toBe(false);
      expect(service.sourceUrl).toMatch(/^https:\/\//);
      expect(service.sourceObservedAt).toBeTruthy();
      expect(service.availabilityConfirmedAt).toBeNull();
      expect(service.priceFrom).toBe(0);
      expect(service.imageUrl.startsWith("/catalog/real/") || service.imageUrl.startsWith("/catalog/telegram/")).toBe(true);
      expect(existsSync(join(process.cwd(), "public", service.imageUrl.slice(1)))).toBe(true);
    }
  });
});

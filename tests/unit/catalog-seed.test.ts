import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { categories, services, suppliers } from "@/lib/demo-data";

describe("стартовый каталог", () => {
  it("содержит 48 опубликованных SKU с уникальными кодами", () => {
    expect(services).toHaveLength(48);
    expect(new Set(services.map((service) => service.id)).size).toBe(48);
    expect(new Set(services.map((service) => service.sku)).size).toBe(48);
    expect(services.every((service) => service.active && service.published)).toBe(true);
  });

  it("связывает каждый SKU с категорией, поставщиком и локальной фотографией", () => {
    for (const service of services) {
      expect(categories.some((category) => category.id === service.categoryId)).toBe(true);
      expect(suppliers.some((supplier) => supplier.id === service.supplierId)).toBe(true);
      expect(service.imageUrl.startsWith("/catalog/photos/")).toBe(true);
      expect(existsSync(join(process.cwd(), "public", service.imageUrl))).toBe(true);
    }
  });
});

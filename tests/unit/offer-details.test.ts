import { describe, expect, it } from "vitest";
import { categories, services } from "@/lib/demo-data";
import { getOfferDetails } from "@/lib/offer-details";

describe("страница предложения", () => {
  it("даёт каждому SKU описание, пакеты, характеристики и портфолио", () => {
    for (const service of services) {
      const details = getOfferDetails(service);
      expect(details.fullDescription.ru.length).toBeGreaterThan(service.description.length);
      expect(details.packages.length).toBeGreaterThanOrEqual(2);
      expect(details.facts.length).toBeGreaterThanOrEqual(3);
      expect(details.media.length).toBeGreaterThanOrEqual(1);
      expect(details.eventTypes.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("показывает профиль исполнителя в примере ведущего", () => {
    const service = services.find((item) => item.id === "service-orzu-host");
    expect(service).toBeDefined();
    const details = getOfferDetails(service!);
    expect(details.person).toMatchObject({ name: "Азиз Рахимов", age: 32, experienceYears: 8 });
    expect(details.media.length).toBeGreaterThanOrEqual(4);
  });

  it("добавляет отдельную категорию для предложения руки и сердца и сохраняет подарки", () => {
    expect(categories.some((category) => category.id === "cat-marry-me")).toBe(true);
    expect(categories.some((category) => category.id === "cat-gifts-print")).toBe(true);
    expect(services.some((service) => service.categoryId === "cat-marry-me")).toBe(true);
  });
});

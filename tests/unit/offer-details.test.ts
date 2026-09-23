import { describe, expect, it } from "vitest";
import { categories, services } from "@/lib/demo-data";
import { eventTypeOptions, getOfferDetails } from "@/lib/offer-details";

describe("страница предложения", () => {
  it("даёт каждому SKU исходное описание и фото без выдуманных пакетов и профиля исполнителя", () => {
    for (const service of services) {
      const details = getOfferDetails(service);
      expect(details.fullDescription.ru).toBe(service.description);
      expect(details.packages).toEqual([]);
      expect(details.person).toBeUndefined();
      expect(details.media.length).toBeGreaterThanOrEqual(1);
      expect(details.media[0].url).toBe(service.imageUrl);
      expect(details.eventTypes.length).toBeGreaterThanOrEqual(2);
      expect(details.facts.find((fact) => fact.label.ru === "Источник")?.href).toBe(service.sourceUrl);
    }
  });

  it("не присваивает внешнему автору неподтверждённый возраст и опыт", () => {
    const service = services.find((item) => item.categoryId === "cat-host")!;
    const details = getOfferDetails(service);
    expect(details.person).toBeUndefined();
    expect(details.facts.some((fact) => fact.label.ru === "Источник")).toBe(true);
  });

  it("ссылается на конкретную публикацию ресторана MANANA", () => {
    const service = services.find((item) => item.id === "offer-tg-890")!;
    expect(getOfferDetails(service).facts.find((fact) => fact.label.ru === "Источник")?.href)
      .toBe("https://t.me/EventUzbekistan/890");
  });

  it("показывает ссылку на опубликованное видео только у предложения, где она есть в источнике", () => {
    const service = services.find((item) => item.id === "offer-ID14KGI")!;
    const media = getOfferDetails(service).media;
    expect(media.some((item) => item.type === "youtube" && item.url.startsWith("https://www.youtube.com/watch"))).toBe(true);
  });

  it("добавляет отдельную категорию для предложения руки и сердца и сохраняет подарки", () => {
    expect(categories.some((category) => category.id === "cat-marry-me")).toBe(true);
    expect(categories.some((category) => category.id === "cat-gifts-print")).toBe(true);
    expect(services.some((service) => service.categoryId === "cat-marry-me")).toBe(true);
  });

  it("задаёт восемь независимых типов события из ТЗ 1.1", () => {
    expect(eventTypeOptions.map((item) => item.ru)).toEqual([
      "Свадьба",
      "Никах / религиозный обряд",
      "Юбилей / день рождения",
      "Детский праздник",
      "Корпоратив / конференция",
      "Тимбилдинг",
      "Событие HoReCa",
      "Другое семейное торжество",
    ]);
  });
});

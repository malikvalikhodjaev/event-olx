import { describe, expect, it } from "vitest";
import { services } from "@/lib/demo-data";
import { createEstimateDraft, createEstimateRevision, estimateLineTotal, estimateTotal, validateEstimateDraft } from "@/lib/estimate";

describe("расчёт мероприятия", () => {
  it("подставляет количество гостей в предложение с ценой за гостя", () => {
    const catering = services.find((service) => service.id === "service-silk-catering");
    expect(catering).toBeDefined();
    const draft = createEstimateDraft(catering!);
    expect(draft.guestCount).toBe(50);
    expect(draft.lines[0]).toMatchObject({ quantity: 50, unitPrice: 240_000, unit: "за гостя" });
    expect(estimateLineTotal(draft.lines[0])).toBe(12_000_000);
  });

  it("считает строки и создаёт неизменяемый снимок новой версии", () => {
    const catering = services.find((service) => service.id === "service-silk-catering")!;
    const draft = {
      ...createEstimateDraft(catering),
      eventDate: "2026-10-18",
      guestCount: 80,
      lines: [
        { id: "menu", title: "Меню", quantity: 80, unit: "за гостя", unitPrice: 300_000 },
        { id: "delivery", title: "Доставка", quantity: 1, unit: "за услугу", unitPrice: 500_000 },
      ],
    };
    expect(validateEstimateDraft(draft)).toEqual([]);
    expect(estimateTotal(draft.lines)).toBe(24_500_000);
    const revision = createEstimateRevision(draft, 2, "supplier", "2026-09-05T12:00:00Z", "estimate-2");
    draft.lines[0].unitPrice = 1;
    expect(revision).toMatchObject({ version: 2, sender: "supplier", total: 24_500_000 });
    expect(revision.lines[0].unitPrice).toBe(300_000);
  });

  it("не принимает расчёт без даты и корректных строк", () => {
    const hall = services.find((service) => service.id === "service-silk-hall")!;
    const draft = createEstimateDraft(hall);
    draft.city = "";
    draft.guestCount = 0;
    draft.lines[0].quantity = 0;
    expect(validateEstimateDraft(draft)).toEqual(expect.arrayContaining(["event_date", "city", "guest_count", "line_values"]));
  });
});

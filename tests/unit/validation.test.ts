import { describe, expect, it } from "vitest";
import { requestSchema } from "@/lib/validation";

describe("requestSchema", () => {
  const valid = { clientName: "Алина", clientPhone: "+998 90 123 45 67", serviceId: "service-silk-hall", eventType: "Свадьба", eventDate: "2026-10-18", city: "Ташкент", guestCount: 120, budget: 25000000, message: "Нужен зал на вечер и информация по свободной дате." };

  it("принимает нормализованную заявку", () => {
    expect(requestSchema.safeParse(valid).success).toBe(true);
  });

  it("не принимает пустой контекст и нулевое число гостей", () => {
    const result = requestSchema.safeParse({ ...valid, guestCount: 0, message: "мало" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.map((issue) => issue.path[0])).toEqual(expect.arrayContaining(["guestCount", "message"]));
  });
});

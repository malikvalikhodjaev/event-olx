import { describe, expect, it } from "vitest";
import { freshnessState, responseLabel } from "@/lib/format";

describe("trust signals", () => {
  it("различает свежие и устаревшие данные", () => {
    expect(freshnessState("2026-08-31T09:30:00+05:00").tone).toBe("success");
    expect(freshnessState("2026-06-12T11:00:00+05:00").tone).toBe("danger");
  });

  it("не показывает статистику ответа на малой выборке", () => {
    expect(responseLabel(15, 2)).toContain("Недостаточно данных");
    expect(responseLabel(38, 12)).toContain("38 мин");
  });
});

import { describe, expect, it } from "vitest";
import { categoryName, categorySearchText, cityName, normalizeLocale, priceUnit } from "@/lib/i18n";

describe("локализация Marosim", () => {
  it("принимает только поддерживаемые языки", () => {
    expect(normalizeLocale("uz")).toBe("uz");
    expect(normalizeLocale("ru")).toBe("ru");
    expect(normalizeLocale("en")).toBe("ru");
  });

  it("локализует справочники без изменения идентификаторов", () => {
    expect(categoryName("uz", { id: "cat-host", name: "Ведущие и развлечения" })).toBe("Boshlovchilar va ko‘ngilochar dasturlar");
    expect(cityName("uz", "Самарканд")).toBe("Samarqand");
    expect(priceUnit("uz", "за гостя")).toBe("har bir mehmon uchun");
    expect(categorySearchText("uz", "cat-host")).toContain("boshlovchi");
  });
});

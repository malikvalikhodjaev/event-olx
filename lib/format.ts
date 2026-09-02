import type { Locale } from "@/lib/i18n";

export function formatMoney(value: number, locale: Locale = "ru") {
  const formatted = Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  return formatted + (locale === "uz" ? " so‘m" : " сум");
}

export function formatDateTime(value: string, locale: Locale = "ru") {
  const source = new Date(value);
  const tashkent = new Date(source.getTime() + 5 * 60 * 60 * 1_000);
  const months = locale === "uz"
    ? ["yan.", "fev.", "mar.", "apr.", "may", "iyun", "iyul", "avg.", "sen.", "okt.", "noy.", "dek."]
    : ["янв.", "февр.", "мар.", "апр.", "мая", "июн.", "июл.", "авг.", "сент.", "окт.", "нояб.", "дек."];
  const day = tashkent.getUTCDate().toString().padStart(2, "0");
  const year = tashkent.getUTCFullYear();
  const hours = tashkent.getUTCHours().toString().padStart(2, "0");
  const minutes = tashkent.getUTCMinutes().toString().padStart(2, "0");

  return `${day} ${months[tashkent.getUTCMonth()]} ${year}, ${hours}:${minutes}`;
}

export function freshnessState(updatedAt: string, now = new Date("2026-09-01T22:00:00+05:00"), locale: Locale = "ru") {
  const ageDays = Math.floor((now.getTime() - new Date(updatedAt).getTime()) / 86_400_000);
  if (ageDays <= 7) return { label: locale === "uz" ? "Yaqinda yangilangan" : "Обновлено недавно", tone: "success" as const, ageDays };
  if (ageDays <= 30) return { label: locale === "uz" ? "Aniqlashtirish kerak" : "Лучше уточнить", tone: "warning" as const, ageDays };
  return { label: locale === "uz" ? "Uzoq vaqt yangilanmagan" : "Давно не обновлялось", tone: "danger" as const, ageDays };
}

export function responseLabel(minutes: number | null, sampleSize: number, locale: Locale = "ru") {
  if (minutes === null || sampleSize < 5) return locale === "uz" ? "Baholash uchun javoblar hali kam" : "Пока мало ответов для оценки";
  if (minutes < 60) return locale === "uz" ? `Odatda ${minutes} daqiqada javob beradi` : `Обычно отвечает за ${minutes} мин`;
  const hours = Math.round((minutes / 60) * 10) / 10;
  return locale === "uz" ? `Odatda ${hours} soatda javob beradi` : `Обычно отвечает за ${hours} ч`;
}

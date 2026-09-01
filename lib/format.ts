export function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value) + " сум";
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Tashkent",
  }).format(new Date(value));
}

export function freshnessState(updatedAt: string, now = new Date("2026-09-01T22:00:00+05:00")) {
  const ageDays = Math.floor((now.getTime() - new Date(updatedAt).getTime()) / 86_400_000);
  if (ageDays <= 7) return { label: "Свежие данные", tone: "success" as const, ageDays };
  if (ageDays <= 30) return { label: "Стоит подтвердить", tone: "warning" as const, ageDays };
  return { label: "Данные устарели", tone: "danger" as const, ageDays };
}

export function responseLabel(minutes: number | null, sampleSize: number) {
  if (minutes === null || sampleSize < 5) return "Недостаточно данных";
  if (minutes < 60) return `Обычно отвечает за ${minutes} мин`;
  const hours = Math.round((minutes / 60) * 10) / 10;
  return `Обычно отвечает за ${hours} ч`;
}

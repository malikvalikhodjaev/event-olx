import type { DemoRole } from "@/lib/types";

export const roleOptions: Array<{ role: DemoRole; title: string; description: string }> = [
  { role: "client", title: "Я хочу найти для события", description: "Выбрать услуги, купить нужные вещи или арендовать технику" },
  { role: "client_planner", title: "Я организую событие", description: "Собрать план, бюджет и список выбранных предложений" },
  { role: "supplier", title: "Я предоставляю услуги или продаю товары", description: "Разместить предложения и отвечать клиентам в чате" },
  { role: "supplier_planner", title: "Я планирую работу команды", description: "Следить за датами, загрузкой и ответами клиентам" },
  { role: "admin", title: "Управляю платформой", description: "Проверять карточки и обращения пользователей" },
];

export function isDemoRole(value: string | undefined): value is DemoRole {
  return roleOptions.some((option) => option.role === value);
}

export function roleDestination(role: DemoRole) {
  if (role === "admin") return "/admin";
  if (role === "supplier" || role === "supplier_planner") return "/supplier";
  if (role === "client_planner") return "/planner";
  return "/catalog";
}

export function roleTitle(role: DemoRole) {
  return roleOptions.find((option) => option.role === role)?.title ?? "Пользователь";
}

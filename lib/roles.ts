import type { DemoRole } from "@/lib/types";

export type ProfileRole = Extract<DemoRole, "client" | "supplier">;

export const profileRoleOptions: Array<{ role: ProfileRole; title: string; description: string }> = [
  { role: "client", title: "Я хочу найти для события", description: "Выбрать услуги, купить нужные вещи или арендовать технику" },
  { role: "supplier", title: "Я предоставляю услуги или продаю товары", description: "Разместить предложения и отвечать клиентам в чате" },
];

const demoRoles: DemoRole[] = ["client", "client_planner", "supplier", "supplier_planner", "admin"];

export function isDemoRole(value: string | undefined): value is DemoRole {
  return demoRoles.some((role) => role === value);
}

export function isProfileRole(value: string | undefined): value is ProfileRole {
  return profileRoleOptions.some((option) => option.role === value);
}

export function roleDestination(role: DemoRole) {
  if (role === "admin") return "/admin";
  if (role === "supplier" || role === "supplier_planner") return "/supplier";
  if (role === "client_planner") return "/planner";
  return "/catalog";
}

export function roleTitle(role: DemoRole) {
  const titles: Record<DemoRole, string> = {
    client: "Ищу для события",
    client_planner: "Планирую событие",
    supplier: "Предоставляю услуги или продаю товары",
    supplier_planner: "Планирую работу команды",
    admin: "Администратор",
  };
  return titles[role];
}

export function profileDestination(role: ProfileRole, requestedPath: string) {
  if (role === "supplier") return "/supplier";
  if (!requestedPath.startsWith("/") || requestedPath.startsWith("//")) return "/catalog";
  if (requestedPath.startsWith("/supplier") || requestedPath.startsWith("/admin")) return "/catalog";
  return requestedPath;
}

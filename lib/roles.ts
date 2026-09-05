import type { DemoRole } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

export type ProfileRole = Extract<DemoRole, "client" | "supplier">;

export const profileRoleOptions: Array<{ role: ProfileRole; title: string; description: string }> = [
  { role: "client", title: "Я хочу найти для события", description: "Выбрать услуги, купить нужные вещи или арендовать технику" },
  { role: "supplier", title: "Я предлагаю услуги или товары", description: "Размещать предложения и отвечать клиентам в чате" },
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

export function roleTitle(role: DemoRole, locale: Locale = "ru") {
  const titles: Record<DemoRole, string> = {
    client: "Ищу для события",
    client_planner: "Планирую событие",
    supplier: "Автор предложения",
    supplier_planner: "Планирую работу команды",
    admin: "Администратор",
  };
  const titlesUz: Record<DemoRole, string> = {
    client: "Tadbir uchun izlayman",
    client_planner: "Tadbirni rejalashtiraman",
    supplier: "E’lon muallifi",
    supplier_planner: "Jamoa ishini rejalashtiraman",
    admin: "Administrator",
  };
  return locale === "uz" ? titlesUz[role] : titles[role];
}

export function profileDestination(role: ProfileRole, requestedPath: string) {
  if (role === "supplier") {
    if (!requestedPath.startsWith("/") || requestedPath.startsWith("//")) return "/supplier";
    return requestedPath === "/chats" || requestedPath === "/account" || requestedPath === "/supplier" || requestedPath.startsWith("/supplier/") || requestedPath === "/mobile_app/supplier"
      ? requestedPath
      : "/supplier";
  }
  if (!requestedPath.startsWith("/") || requestedPath.startsWith("//")) return "/catalog";
  if (requestedPath.startsWith("/supplier") || requestedPath.startsWith("/admin")) return "/catalog";
  return requestedPath;
}

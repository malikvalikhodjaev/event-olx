"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";

const guestItems = [
  { href: "/mobile_app", icon: "⌂", label: "Главная" },
  { href: "/catalog", icon: "⌕", label: "Каталог" },
  { href: "/mobile_app/supplier", icon: "↗", label: "Поставщикам" },
  { href: "/login", icon: "●", label: "Войти" },
];

export function MobileNavigation() {
  const pathname = usePathname();
  const { state } = useDemoSession();
  const isClient = state.role === "client" || state.role === "client_planner";
  const isSupplier = state.role === "supplier" || state.role === "supplier_planner";
  const items = !state.signedIn
    ? guestItems
    : [
        ...(isClient ? [{ href: "/mobile_app", icon: "⌂", label: "Главная" }] : []),
        ...(isClient ? [{ href: "/saved", icon: "♡", label: "Сохранено" }, { href: "/chats", icon: "↗", label: "Чаты" }] : []),
        ...(isSupplier ? [{ href: "/mobile_app/supplier", icon: "⌂", label: "Главная" }, { href: "/supplier", icon: "▣", label: "Предложения" }, { href: "/chats", icon: "↗", label: "Чаты" }] : []),
        ...(state.role === "admin" ? [{ href: "/admin", icon: "✓", label: "Управление" }] : []),
        { href: "/account", icon: "●", label: "Кабинет" },
      ];

  return (
    <nav className="mobile-nav" aria-label="Мобильная навигация">
      {items.map((item) => {
        const active = item.href === "/mobile_app"
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link className={active ? "active" : ""} href={item.href} key={item.href} aria-current={active ? "page" : undefined}>
            <span aria-hidden="true">{item.icon}</span>
            <small>{item.label}</small>
          </Link>
        );
      })}
    </nav>
  );
}

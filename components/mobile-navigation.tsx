"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";

const guestItems = [
  { href: "/catalog", icon: "⌕", label: "Каталог" },
  { href: "/planner", icon: "✓", label: "План" },
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
        { href: "/catalog", icon: "⌕", label: "Каталог" },
        ...(isClient ? [{ href: "/planner", icon: "✓", label: "План" }, { href: "/requests", icon: "↗", label: "Заявки" }] : []),
        ...(isSupplier ? [{ href: "/supplier", icon: "↗", label: "Каталог" }] : []),
        ...(state.role === "admin" ? [{ href: "/admin", icon: "✓", label: "Управление" }] : []),
        { href: "/account", icon: "●", label: "Кабинет" },
      ];

  return (
    <nav className="mobile-nav" aria-label="Мобильная навигация">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
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

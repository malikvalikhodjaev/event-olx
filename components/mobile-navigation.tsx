"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { useLocale } from "@/components/locale-provider";

export function MobileNavigation() {
  const pathname = usePathname();
  const { state } = useDemoSession();
  const { text } = useLocale();
  const isClient = state.role === "client" || state.role === "client_planner";
  const isSupplier = state.role === "supplier" || state.role === "supplier_planner";
  const guestItems = [
    { href: "/mobile_app", icon: "⌂", label: text("Главная", "Bosh sahifa") },
    { href: "/catalog", icon: "⌕", label: text("Каталог", "Katalog") },
    { href: "/mobile_app/supplier", icon: "↗", label: text("Предложить", "E’lon berish") },
    { href: "/login", icon: "●", label: text("Войти", "Kirish") },
  ];
  const items = !state.signedIn
    ? guestItems
    : [
        ...(isClient ? [{ href: "/mobile_app", icon: "⌂", label: text("Главная", "Bosh sahifa") }] : []),
        ...(isClient ? [{ href: "/saved", icon: "♡", label: text("Сохранено", "Saqlangan") }, { href: "/chats", icon: "↗", label: text("Чаты", "Xabarlar") }] : []),
        ...(isSupplier ? [{ href: "/mobile_app/supplier", icon: "⌂", label: text("Главная", "Bosh sahifa") }, { href: "/supplier", icon: "▣", label: text("Предложения", "E’lonlar") }, { href: "/chats", icon: "↗", label: text("Чаты", "Xabarlar") }] : []),
        ...(state.role === "admin" ? [{ href: "/admin", icon: "✓", label: "Управление" }] : []),
        { href: "/account", icon: "●", label: text("Кабинет", "Kabinet") },
      ];

  return (
    <nav className="mobile-nav" aria-label={text("Мобильная навигация", "Mobil navigatsiya")}>
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

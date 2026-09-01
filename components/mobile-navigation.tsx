"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/catalog", icon: "⌕", label: "Каталог" },
  { href: "/planner", icon: "✓", label: "План" },
  { href: "/requests", icon: "↗", label: "Заявки" },
  { href: "/account", icon: "●", label: "Профиль" },
];

export function MobileNavigation() {
  const pathname = usePathname();

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

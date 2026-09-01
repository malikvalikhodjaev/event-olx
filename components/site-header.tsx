"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import type { DemoRole } from "@/lib/types";

const roleLabels: Record<DemoRole, string> = {
  client: "Клиент",
  client_planner: "Планировщик клиента",
  supplier: "Поставщик",
  supplier_planner: "Планировщик поставщика",
  admin: "Администратор",
};

export function SiteHeader() {
  const { role, setRole } = useDemoSession();

  return (
    <>
      <div className="demo-strip">Validation MVP · демонстрационные данные · заявка не является бронью или оплатой</div>
      <header className="site-header">
        <div className="shell header-row">
          <Link href="/" className="brand" aria-label="EventHub UZ — главная">
            <span className="brand-mark">E</span>
            <span>EventHub UZ</span>
          </Link>
          <nav className="top-nav" aria-label="Основная навигация">
            <Link href="/catalog">Каталог</Link>
            <Link href="/planner">Планировщик</Link>
            <Link href="/requests">Заявки</Link>
            <Link href="/supplier">Поставщик</Link>
            <Link href="/admin">Модерация</Link>
          </nav>
          <div className="role-control">
            <label className="small muted" htmlFor="demo-role">Роль</label>
            <select
              id="demo-role"
              value={role}
              onChange={(event) => setRole(event.target.value as DemoRole)}
              aria-label="Выбрать демонстрационную роль"
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>
    </>
  );
}

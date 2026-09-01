"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { demoAccounts } from "@/lib/demo-data";

function destination(role: (typeof demoAccounts)[number]["role"]) {
  if (role === "admin") return "/admin";
  if (role === "supplier" || role === "supplier_planner") return "/supplier";
  if (role === "client_planner") return "/planner";
  return "/catalog";
}

export function DemoAccounts() {
  const { setRole, reset } = useDemoSession();
  return (
    <>
      <div className="grid grid-3">
        {demoAccounts.map((account) => (
          <article className="card account-card" key={account.email}>
            <h3>{account.name}</h3>
            <p className="muted">{account.description}</p>
            <code>{account.email}</code>
            <code>{account.password}</code>
            <Link className="button button-primary button-small" href={destination(account.role)} onClick={() => setRole(account.role)}>Войти в демо-роли</Link>
          </article>
        ))}
      </div>
      <button className="button button-secondary" style={{ marginTop: 18 }} type="button" onClick={reset}>Сбросить демонстрационные данные</button>
    </>
  );
}

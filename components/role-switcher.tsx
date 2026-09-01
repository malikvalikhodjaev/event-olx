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

export function RoleSwitcher() {
  const { setRole } = useDemoSession();
  return (
    <div className="grid grid-3">
      {demoAccounts.map((account) => (
        <article className="card account-card" key={account.email}>
          <h3>{account.name}</h3>
          <p className="muted">{account.description}</p>
          <Link className="button button-primary button-small" href={destination(account.role)} onClick={() => setRole(account.role)}>Открыть раздел</Link>
        </article>
      ))}
    </div>
  );
}

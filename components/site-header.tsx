"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";

export function SiteHeader() {
  const { state } = useDemoSession();
  const isClient = state.role === "client" || state.role === "client_planner";
  const isSupplier = state.role === "supplier" || state.role === "supplier_planner";

  return (
    <header className="site-header">
      <div className="shell header-row">
        <Link href="/" className="brand" aria-label="Marosim — главная">
          <span className="brand-mark">M</span>
          <span>Marosim</span>
        </Link>
        <nav className="top-nav" aria-label="Основная навигация">
          <Link href="/catalog">Каталог</Link>
          {(!state.signedIn || isClient) ? <Link href="/planner">План события</Link> : null}
          {state.signedIn && (isClient || isSupplier) ? <Link href="/chats">Сообщения</Link> : null}
          {state.signedIn && isSupplier ? <Link href="/supplier">Мои предложения</Link> : null}
          {state.signedIn && state.role === "admin" ? <Link href="/admin">Управление</Link> : null}
          <Link href="/mobile_app">На телефон</Link>
        </nav>
        <Link className="header-account" href={state.signedIn ? "/account" : "/login"}>{state.signedIn ? "Кабинет" : "Войти"}</Link>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/components/locale-provider";

export function SiteHeader() {
  const { state } = useDemoSession();
  const { text } = useLocale();
  const isClient = state.role === "client" || state.role === "client_planner";
  const isSupplier = state.role === "supplier" || state.role === "supplier_planner";

  return (
    <header className="site-header">
      <div className="shell header-row">
        <Link href="/" className="brand" aria-label={text("Marosim — главная", "Marosim — bosh sahifa")}>
          <span className="brand-mark">M</span>
          <span>Marosim</span>
        </Link>
        <nav className="top-nav" aria-label={text("Основная навигация", "Asosiy navigatsiya")}>
          <Link href="/catalog">{text("Каталог", "Katalog")}</Link>
          {(!state.signedIn || isClient) ? <Link href="/planner">{text("План события", "Tadbir rejasi")}</Link> : null}
          {state.signedIn && isClient ? <Link href="/saved">{text("Сохранённые", "Saqlanganlar")}</Link> : null}
          {state.signedIn && (isClient || isSupplier) ? <Link href="/chats">{text("Сообщения", "Xabarlar")}</Link> : null}
          {state.signedIn && isSupplier ? <Link href="/supplier">{text("Мои предложения", "Mening e’lonlarim")}</Link> : null}
          {state.signedIn && state.role === "admin" ? <Link href="/admin">Управление</Link> : null}
          {!state.signedIn ? <Link href="/login?role=supplier&next=/supplier">{text("Разместить предложение", "E’lon joylashtirish")}</Link> : null}
          <Link href="/mobile_app">{text("Мобильное приложение", "Mobil ilova")}</Link>
        </nav>
        <div className="header-actions">
          <LanguageSwitcher />
          <Link className="header-account" href={state.signedIn ? "/account" : "/login"}>{state.signedIn ? text("Кабинет", "Kabinet") : text("Войти в Маросим", "Marosim’ga kirish")}</Link>
        </div>
      </div>
    </header>
  );
}

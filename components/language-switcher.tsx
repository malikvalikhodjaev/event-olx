"use client";

import { useLocale } from "@/components/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale, text } = useLocale();

  return (
    <div className="language-switcher" role="group" aria-label={text("Язык сайта", "Sayt tili")}>
      <button type="button" className={locale === "uz" ? "active" : ""} aria-pressed={locale === "uz"} onClick={() => setLocale("uz")}>O‘Z</button>
      <button type="button" className={locale === "ru" ? "active" : ""} aria-pressed={locale === "ru"} onClick={() => setLocale("ru")}>RU</button>
    </div>
  );
}

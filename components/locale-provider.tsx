"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { localeCookieName, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  text: (ru: string, uz: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: React.ReactNode }) {
  const [locale, updateLocale] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((nextLocale: Locale) => {
    document.cookie = `${localeCookieName}=${nextLocale}; Max-Age=31536000; Path=/; SameSite=Lax`;
    document.documentElement.lang = nextLocale;
    updateLocale(nextLocale);
  }, []);

  const text = useCallback((ru: string, uz: string) => locale === "uz" ? uz : ru, [locale]);
  const value = useMemo(() => ({ locale, setLocale, text }), [locale, setLocale, text]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider");
  return value;
}

export function LocalizedText({ ru, uz }: { ru: string; uz: string }) {
  const { text } = useLocale();
  return <>{text(ru, uz)}</>;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { useLocale } from "@/components/locale-provider";

type HomeSearchProps = {
  variant?: "hero" | "mobile";
};

export function HomeSearch({ variant = "hero" }: HomeSearchProps) {
  const router = useRouter();
  const { state } = useDemoSession();
  const { text } = useLocale();
  const [query, setQuery] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    const destination = `/catalog${normalizedQuery ? `?q=${encodeURIComponent(normalizedQuery)}` : ""}`;
    router.push(state.signedIn
      ? destination
      : `/login?role=client&next=${encodeURIComponent(destination)}`);
  }

  return (
    <form className={variant === "mobile" ? "mobile-start-search" : "hero-search"} onSubmit={submit} role="search">
      <label className="sr-only" htmlFor="home-search">{text("Что нужно для события?", "Tadbir uchun nima kerak?")}</label>
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={text("Например, площадка, фотограф или цветы", "Masalan, joy, fotograf yoki gullar")}
      />
      <button className="button" type="submit">{text("Найти", "Topish")}</button>
      <small>{variant === "mobile" ? text("Услуга, товар или техника", "Xizmat, mahsulot yoki texnika") : text("Введите услугу, товар или технику — запрос сохранится после входа.", "Xizmat, mahsulot yoki texnikani kiriting — so‘rov kirgandan keyin saqlanadi.")}</small>
    </form>
  );
}

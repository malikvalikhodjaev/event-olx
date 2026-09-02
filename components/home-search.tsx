"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";

export function HomeSearch() {
  const router = useRouter();
  const { state } = useDemoSession();
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
    <form className="hero-search" onSubmit={submit} role="search">
      <label className="sr-only" htmlFor="home-search">Что нужно для события?</label>
      <input
        id="home-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Например, площадка, фотограф или цветы"
      />
      <button className="button" type="submit">Найти</button>
      <small>Введите услугу, товар или технику — запрос сохранится после входа.</small>
    </form>
  );
}

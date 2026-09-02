"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { roleDestination, roleTitle } from "@/lib/roles";

export function AccountPanel() {
  const router = useRouter();
  const { state, signOut } = useDemoSession();
  const isClient = state.role === "client" || state.role === "client_planner";

  if (!state.signedIn) {
    return (
      <section className="panel account-summary">
        <p className="eyebrow">Кабинет</p>
        <h1>Сначала войдите</h1>
        <p className="lead">После входа здесь появятся ваши диалоги, сохранённые предложения и рабочие разделы.</p>
        <Link className="button button-primary" href="/login">Войти</Link>
      </section>
    );
  }

  return (
    <section className="panel account-summary">
      <p className="eyebrow">Кабинет</p>
      <h1>Вы вошли в Marosim</h1>
      <div className="account-details">
        <div><span>Пользователь</span><strong>{state.accountName}</strong></div>
        <div><span>Раздел</span><strong>{roleTitle(state.role)}</strong></div>
        {isClient ? <div><span>Сохранено</span><strong>{state.shortlist.length}</strong></div> : null}
      </div>
      <div className="actions">
        <Link className="button button-primary" href={roleDestination(state.role)}>{isClient ? "Продолжить поиск" : "Продолжить"}</Link>
        {isClient ? <Link className="button button-secondary" href="/saved">Сохранённые</Link> : null}
        {state.role !== "admin" ? <Link className="button button-secondary" href="/onboarding">Изменить профиль</Link> : null}
        <button className="button button-secondary" type="button" onClick={() => { signOut(); router.push("/"); }}>Выйти</button>
      </div>
    </section>
  );
}

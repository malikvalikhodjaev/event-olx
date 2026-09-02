"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { roleDestination, roleTitle } from "@/lib/roles";
import { useLocale } from "@/components/locale-provider";

export function AccountPanel() {
  const router = useRouter();
  const { state, signOut } = useDemoSession();
  const { locale, text } = useLocale();
  const isClient = state.role === "client" || state.role === "client_planner";

  if (!state.signedIn) {
    return (
      <section className="panel account-summary">
        <p className="eyebrow">{text("Кабинет", "Kabinet")}</p>
        <h1>{text("Сначала войдите", "Avval tizimga kiring")}</h1>
        <p className="lead">{text("После входа здесь появятся ваши диалоги, сохранённые предложения и рабочие разделы.", "Kirgandan so‘ng bu yerda xabarlaringiz, saqlangan takliflar va ish bo‘limlari paydo bo‘ladi.")}</p>
        <Link className="button button-primary" href="/login">{text("Войти", "Kirish")}</Link>
      </section>
    );
  }

  return (
    <section className="panel account-summary">
      <p className="eyebrow">{text("Кабинет", "Kabinet")}</p>
      <h1>{text("Вы вошли в Marosim", "Marosim’ga kirdingiz")}</h1>
      <div className="account-details">
        <div><span>{text("Пользователь", "Foydalanuvchi")}</span><strong>{state.accountName}</strong></div>
        <div><span>{text("Раздел", "Bo‘lim")}</span><strong>{roleTitle(state.role, locale)}</strong></div>
        {isClient ? <div><span>{text("Сохранено", "Saqlangan")}</span><strong>{state.shortlist.length}</strong></div> : null}
      </div>
      <div className="actions">
        <Link className="button button-primary" href={roleDestination(state.role)}>{isClient ? text("Продолжить поиск", "Qidirishni davom ettirish") : text("Продолжить", "Davom etish")}</Link>
        {isClient ? <Link className="button button-secondary" href="/saved">{text("Сохранённые", "Saqlanganlar")}</Link> : null}
        {state.role !== "admin" ? <Link className="button button-secondary" href="/onboarding">{text("Изменить профиль", "Profilni o‘zgartirish")}</Link> : null}
        <button className="button button-secondary" type="button" onClick={() => { signOut(); router.push("/"); }}>{text("Выйти", "Chiqish")}</button>
      </div>
    </section>
  );
}

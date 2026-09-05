"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { isProfileRole, profileDestination, profileRoleOptions, type ProfileRole } from "@/lib/roles";
import { useLocale } from "@/components/locale-provider";

export function ProfileSetup({ initialIntent = "client", initialNext = "/catalog" }: { initialIntent?: string; initialNext?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedInitialIntent = searchParams.get("intent") ?? initialIntent;
  const resolvedInitialNext = searchParams.get("next") ?? initialNext;
  const { state, setRole } = useDemoSession();
  const { locale, text } = useLocale();
  const [role, chooseRole] = useState<ProfileRole>(isProfileRole(resolvedInitialIntent) ? resolvedInitialIntent : "client");

  if (!state.signedIn) {
    const loginHref = `/login?role=${role}&next=${encodeURIComponent(resolvedInitialNext)}`;
    return (
      <section className="panel account-summary">
        <p className="eyebrow">{text("Профиль", "Profil")}</p>
        <h1>{text("Сначала войдите", "Avval tizimga kiring")}</h1>
        <p className="lead">{text("Выбор профиля доступен после авторизации.", "Profilni kirgandan keyin tanlash mumkin.")}</p>
        <Link className="button button-primary" href={loginHref}>{text("Войти", "Kirish")}</Link>
      </section>
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRole(role);
    router.replace(profileDestination(role, resolvedInitialNext));
  }

  return (
    <section className="onboarding-layout">
      <form className="panel onboarding-card" onSubmit={submit}>
        <p className="eyebrow">{text("Настройка профиля · шаг 2 из 2", "Profilni sozlash · 2-qadam")}</p>
        <h1>{text("Как вы будете использовать Маросим?", "Marosim’dan qanday foydalanasiz?")}</h1>
        <p className="lead">{text("Выберите основной сценарий. Позже его можно изменить в кабинете.", "Asosiy maqsadni tanlang. Keyin uni kabinetda o‘zgartirish mumkin.")}</p>

        <fieldset className="role-picker">
          <legend>{text("Выберите один вариант", "Bitta variantni tanlang")}</legend>
          <div className="role-options">
            {profileRoleOptions.map((option) => (
              <label className="role-option" key={option.role}>
                <input
                  type="radio"
                  name="profile-role"
                  value={option.role}
                  checked={role === option.role}
                  onChange={() => chooseRole(option.role)}
                />
                <span>
                  <strong>{locale === "uz" ? (option.role === "client" ? "Tadbir uchun keraklisini topmoqchiman" : "Xizmat yoki mahsulot taklif qilaman") : option.title}</strong>
                  <small>{locale === "uz" ? (option.role === "client" ? "Xizmat tanlash, kerakli buyumlarni sotib olish yoki texnika ijarasi" : "E’lon joylashtirish va mijozlarga xabarlarda javob berish") : option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className="button button-primary onboarding-submit" type="submit">{text("Продолжить", "Davom etish")}</button>
      </form>
    </section>
  );
}

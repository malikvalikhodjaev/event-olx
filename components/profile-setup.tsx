"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { isProfileRole, profileDestination, profileRoleOptions, type ProfileRole } from "@/lib/roles";

export function ProfileSetup({ initialIntent = "client", initialNext = "/catalog" }: { initialIntent?: string; initialNext?: string }) {
  const router = useRouter();
  const { state, setRole } = useDemoSession();
  const [role, chooseRole] = useState<ProfileRole>(isProfileRole(initialIntent) ? initialIntent : "client");

  if (!state.signedIn) {
    const loginHref = `/login?role=${role}&next=${encodeURIComponent(initialNext)}`;
    return (
      <section className="panel account-summary">
        <p className="eyebrow">Профиль</p>
        <h1>Сначала войдите</h1>
        <p className="lead">Выбор профиля доступен после авторизации.</p>
        <Link className="button button-primary" href={loginHref}>Войти</Link>
      </section>
    );
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRole(role);
    router.replace(profileDestination(role, initialNext));
  }

  return (
    <section className="onboarding-layout">
      <form className="panel onboarding-card" onSubmit={submit}>
        <p className="eyebrow">Настройка профиля · шаг 2 из 2</p>
        <h1>Как вы будете использовать Маросим?</h1>
        <p className="lead">Выберите основной сценарий. Позже его можно изменить в кабинете.</p>

        <fieldset className="role-picker">
          <legend>Выберите один вариант</legend>
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
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button className="button button-primary onboarding-submit" type="submit">Продолжить</button>
      </form>
    </section>
  );
}

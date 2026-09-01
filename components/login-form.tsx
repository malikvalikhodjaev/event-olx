"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { isDemoRole, roleDestination, roleOptions } from "@/lib/roles";
import type { DemoRole } from "@/lib/types";

export function LoginForm({ initialRole = "client" }: { initialRole?: string }) {
  const router = useRouter();
  const { signIn } = useDemoSession();
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<DemoRole>(isDemoRole(initialRole) ? initialRole : "client");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.trim()) {
      setError("Введите телефон или электронную почту");
      return;
    }
    if (password.length < 4) {
      setError("Введите пароль — не меньше 4 символов");
      return;
    }
    signIn(role, contact.trim());
    router.push(roleDestination(role));
  }

  return (
    <section className="login-layout">
      <div className="login-intro">
        <p className="eyebrow">Вход в Marosim</p>
        <h1>Продолжите со своей задачей</h1>
        <p className="lead">Выберите, что вы хотите сделать, и откройте нужный раздел.</p>
        <Link className="text-link" href="/catalog">Сначала посмотреть каталог <span aria-hidden="true">→</span></Link>
      </div>

      <form className="panel login-panel" onSubmit={submit}>
        <div className="field">
          <label htmlFor="login-contact">Телефон или электронная почта</label>
          <input
            id="login-contact"
            autoComplete="username"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            placeholder="+998 90 123 45 67"
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Пароль</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <fieldset className="role-picker">
          <legend>Что вы хотите сделать?</legend>
          <div className="role-options">
            {roleOptions.map((option) => (
              <label className="role-option" key={option.role}>
                <input
                  type="radio"
                  name="role"
                  value={option.role}
                  checked={role === option.role}
                  onChange={() => setRole(option.role)}
                />
                <span>
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {error ? <p className="error-text" role="alert">{error}</p> : null}
        <button className="button button-primary login-submit" type="submit">Войти</button>
      </form>
    </section>
  );
}

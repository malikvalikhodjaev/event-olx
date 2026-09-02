"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { isDemoRole, roleDestination, roleOptions } from "@/lib/roles";
import type { DemoRole } from "@/lib/types";

const googleAccounts: Record<DemoRole, string> = {
  client: "google.client@marosim.local",
  client_planner: "google.planner@marosim.local",
  supplier: "supplier@marosim.local",
  supplier_planner: "supplier-planner@marosim.local",
  admin: "admin@marosim.local",
};

function safeNext(initialNext: string, role: DemoRole) {
  return initialNext.startsWith("/") && !initialNext.startsWith("//")
    ? initialNext
    : roleDestination(role);
}

export function LoginForm({ initialRole = "client", initialNext = "" }: { initialRole?: string; initialNext?: string }) {
  const router = useRouter();
  const { signIn } = useDemoSession();
  const [role, setRole] = useState<DemoRole>(isDemoRole(initialRole) ? initialRole : "client");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [error, setError] = useState("");
  const availableRoles = useMemo(
    () => roleOptions.filter((option) => option.role !== "admin" || initialRole === "admin"),
    [initialRole],
  );

  function finish(account: string) {
    signIn(role, account);
    router.push(safeNext(initialNext, role));
  }

  function continueWithGoogle() {
    setError("");
    finish(googleAccounts[role]);
  }

  function submitPhone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPhone = phone.replace(/[^\d+]/g, "");
    if (!codeRequested) {
      if (normalizedPhone.length < 9) {
        setError("Введите номер телефона полностью");
        return;
      }
      setPhone(normalizedPhone);
      setCodeRequested(true);
      setError("");
      return;
    }
    if (code !== "1234") {
      setError("Неверный код. Для входа используйте 1234");
      return;
    }
    finish(normalizedPhone);
  }

  return (
    <section className="login-layout">
      <div className="login-intro">
        <p className="eyebrow">Вход в Маросим</p>
        <h1>Начните со своей задачи</h1>
        <p className="lead">Выберите, что хотите сделать, затем продолжите через Google или телефон.</p>
        <Link className="text-link" href="/catalog">Сначала посмотреть каталог <span aria-hidden="true">→</span></Link>
      </div>

      <div className="panel login-panel">
        <fieldset className="role-picker">
          <legend>Я хочу…</legend>
          <div className="role-options">
            {availableRoles.map((option) => (
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

        <div className="auth-methods">
          <button className="button google-button" type="button" onClick={continueWithGoogle}>
            <span className="google-mark" aria-hidden="true">G</span>
            Продолжить с Google
          </button>

          <div className="auth-divider"><span>или</span></div>

          <form className="phone-auth" onSubmit={submitPhone}>
            {!codeRequested ? (
              <div className="field">
                <label htmlFor="login-phone">Номер телефона</label>
                <input
                  id="login-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+998 90 123 45 67"
                />
              </div>
            ) : (
              <>
                <div className="phone-confirmation">
                  <span>Код отправлен на</span>
                  <strong>{phone}</strong>
                  <button type="button" onClick={() => { setCodeRequested(false); setCode(""); setError(""); }}>Изменить номер</button>
                </div>
                <div className="field">
                  <label htmlFor="login-code">Код из SMS</label>
                  <input
                    id="login-code"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={4}
                    value={code}
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    autoFocus
                  />
                </div>
              </>
            )}

            {error ? <p className="error-text" role="alert">{error}</p> : null}
            <button className="button button-primary login-submit" type="submit">
              {codeRequested ? "Подтвердить и продолжить" : "Получить код"}
            </button>
          </form>

          <p className="auth-simulation-note">Пока Google подтверждается сразу, код для телефона — <strong>1234</strong>.</p>
        </div>
      </div>
    </section>
  );
}

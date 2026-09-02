"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { roleDestination } from "@/lib/roles";

const googleUserAccount = "google.user@marosim.local";
const googleAdminAccount = "admin@marosim.local";

function safeNext(initialNext: string, fallback: string) {
  return initialNext.startsWith("/") && !initialNext.startsWith("//")
    ? initialNext
    : fallback;
}

export function LoginForm({ initialRole = "client", initialNext = "" }: { initialRole?: string; initialNext?: string }) {
  const router = useRouter();
  const { signIn } = useDemoSession();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeRequested, setCodeRequested] = useState(false);
  const [error, setError] = useState("");
  const isAdminLogin = initialRole === "admin";
  const initialIntent = initialRole === "supplier" || initialRole === "supplier_planner" ? "supplier" : "client";

  function finish(account: string) {
    if (isAdminLogin) {
      signIn("admin", account);
      router.replace(safeNext(initialNext, roleDestination("admin")));
      return;
    }

    signIn("client", account);
    const next = safeNext(initialNext, roleDestination("client"));
    router.replace(`/onboarding?intent=${initialIntent}&next=${encodeURIComponent(next)}`);
  }

  function continueWithGoogle() {
    setError("");
    finish(isAdminLogin ? googleAdminAccount : googleUserAccount);
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
        <p className="eyebrow">{isAdminLogin ? "Вход для сотрудников" : "Вход в Маросим"}</p>
        <h1>{isAdminLogin ? "Откройте панель управления" : "Войдите, чтобы продолжить"}</h1>
        <p className="lead">{isAdminLogin ? "Используйте служебную учётную запись." : "После входа вы выберете, что хотите делать в Маросим."}</p>
        {!isAdminLogin ? <Link className="text-link" href="/catalog">Сначала посмотреть каталог <span aria-hidden="true">→</span></Link> : null}
      </div>

      <div className="panel login-panel">
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

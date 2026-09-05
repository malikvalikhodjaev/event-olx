"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoSession } from "@/components/demo-session";
import { completeQueuedShortlist } from "@/lib/demo-store";
import { roleDestination } from "@/lib/roles";
import { useLocale } from "@/components/locale-provider";

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
  const { text } = useLocale();
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
    completeQueuedShortlist();
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
        setError(text("Введите номер телефона полностью", "Telefon raqamini to‘liq kiriting"));
        return;
      }
      setPhone(normalizedPhone);
      setCodeRequested(true);
      setError("");
      return;
    }
    if (code !== "1234") {
      setError(text("Неверный код. Для входа используйте 1234", "Kod noto‘g‘ri. Kirish uchun 1234 kodidan foydalaning"));
      return;
    }
    finish(normalizedPhone);
  }

  return (
    <section className="login-layout">
      <div className="login-intro">
        <p className="eyebrow">{isAdminLogin ? "Вход для сотрудников" : text("Вход в Маросим", "Marosim’ga kirish")}</p>
        <h1>{isAdminLogin ? "Откройте панель управления" : text("Войдите, чтобы продолжить", "Davom etish uchun kiring")}</h1>
        <p className="lead">{isAdminLogin ? "Используйте служебную учётную запись." : text("После входа вы выберете, что хотите делать в Маросим.", "Kirgandan so‘ng Marosim’da nima qilmoqchi ekaningizni tanlaysiz.")}</p>
        {!isAdminLogin ? <Link className="text-link" href="/catalog">{text("Сначала посмотреть каталог", "Avval katalogni ko‘rish")} <span aria-hidden="true">→</span></Link> : null}
      </div>

      <div className="panel login-panel">
        <div className="auth-methods">
          <button className="button google-button" type="button" onClick={continueWithGoogle}>
            <span className="google-mark" aria-hidden="true">G</span>
            {text("Продолжить с Google", "Google orqali davom etish")}
          </button>

          <div className="auth-divider"><span>{text("или", "yoki")}</span></div>

          <form className="phone-auth" onSubmit={submitPhone}>
            {!codeRequested ? (
              <div className="field">
                <label htmlFor="login-phone">{text("Номер телефона", "Telefon raqami")}</label>
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
                  <span>{text("Код отправлен на", "Kod yuborildi")}</span>
                  <strong>{phone}</strong>
                  <button type="button" onClick={() => { setCodeRequested(false); setCode(""); setError(""); }}>{text("Изменить номер", "Raqamni o‘zgartirish")}</button>
                </div>
                <div className="field">
                  <label htmlFor="login-code">{text("Код из SMS", "SMS kodi")}</label>
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
              {codeRequested ? text("Подтвердить и продолжить", "Tasdiqlash va davom etish") : text("Получить код", "Kod olish")}
            </button>
          </form>

          <p className="auth-simulation-note">{text("Пока Google подтверждается сразу, код для телефона —", "Hozircha Google darhol tasdiqlanadi, telefon kodi —")} <strong>1234</strong>.</p>
        </div>
      </div>
    </section>
  );
}

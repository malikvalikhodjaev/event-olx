"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { EstimateEditor } from "@/components/estimate-editor";
import { useDemoSession } from "@/components/demo-session";
import { useLocale } from "@/components/locale-provider";
import { sendEstimateRequest } from "@/lib/demo-store";
import { createEstimateDraft } from "@/lib/estimate";
import { serviceTitle, type Locale } from "@/lib/i18n";
import type { EstimateDraft, Service } from "@/lib/types";

const subscribeToNothing = () => () => undefined;

function localizedDefaultDraft(service: Service, locale: Locale) {
  const draft = createEstimateDraft(service);
  return {
    ...draft,
    lines: draft.lines.map((line) => ({ ...line, title: serviceTitle(locale, service) })),
  };
}

function restoreDraft(service: Service, locale: Locale, snapshot: string): EstimateDraft {
  if (!snapshot) return localizedDefaultDraft(service, locale);
  try {
    const draft = JSON.parse(snapshot) as EstimateDraft;
    return Array.isArray(draft.lines) && draft.lines.length ? draft : localizedDefaultDraft(service, locale);
  } catch {
    return localizedDefaultDraft(service, locale);
  }
}

export function OfferEstimateBuilder({ service, onClose }: { service: Service; onClose: () => void }) {
  const router = useRouter();
  const { state, refresh } = useDemoSession();
  const { locale, text } = useLocale();
  const storageKey = `marosim-estimate-draft:${service.id}`;
  const [error, setError] = useState("");
  const storedDraft = useSyncExternalStore(
    subscribeToNothing,
    () => window.sessionStorage.getItem(storageKey) ?? "",
    () => "",
  );
  const initialDraft = useMemo(() => restoreDraft(service, locale, storedDraft), [locale, service, storedDraft]);

  function send(draft: EstimateDraft) {
    if (!state.signedIn) {
      window.sessionStorage.setItem(storageKey, JSON.stringify(draft));
      const destination = `/offers/${service.id}?calculator=1`;
      router.push(`/login?role=client&next=${encodeURIComponent(destination)}`);
      return;
    }
    if (state.role !== "client" && state.role !== "client_planner") {
      setError(text("Чтобы отправить запрос, войдите с профилем клиента.", "So‘rov yuborish uchun mijoz profili bilan kiring."));
      return;
    }
    try {
      const conversationId = sendEstimateRequest(service.id, state.accountName, draft);
      window.sessionStorage.removeItem(storageKey);
      refresh();
      router.push(`/chats?conversation=${encodeURIComponent(conversationId)}`);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : text("Не удалось отправить расчёт", "Hisob-kitobni yuborib bo‘lmadi"));
    }
  }

  return (
    <section className="offer-estimate-builder" aria-labelledby="offer-estimate-title">
      <div className="toolbar">
        <div>
          <p className="eyebrow">{text("Запрос автору предложения", "E’lon muallifiga so‘rov")}</p>
          <h2 id="offer-estimate-title">{text("Предварительный расчёт", "Dastlabki hisob-kitob")}</h2>
          <p className="muted">{text("Укажите параметры события, проверьте таблицу и отправьте её автору. Он сможет вернуть новую версию со своими ценами и комментариями.", "Tadbir ma’lumotlarini kiriting, jadvalni tekshiring va muallifga yuboring. U o‘z narxlari va izohlari bilan yangi versiyani qaytarishi mumkin.")}</p>
        </div>
      </div>
      <EstimateEditor key={`${service.id}-${locale}-${storedDraft ? "stored" : "new"}`} initialDraft={initialDraft} submitLabel={state.signedIn ? text("Отправить автору", "Muallifga yuborish") : text("Войти и отправить", "Kirish va yuborish")} onSubmit={send} onCancel={onClose} />
      {error ? <p className="error-text" role="alert">{error}</p> : null}
    </section>
  );
}

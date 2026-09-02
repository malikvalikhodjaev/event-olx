"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { addChatMessage, startConversation } from "@/lib/demo-store";
import { getServiceById, getSupplierById } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";
import { useLocale } from "@/components/locale-provider";

const supplierId = "supplier-silk-road";
export function ChatWorkspace({
  initialServiceId = "",
  initialConversationId = "",
}: {
  initialServiceId?: string;
  initialConversationId?: string;
}) {
  const { state, refresh } = useDemoSession();
  const { locale, text } = useLocale();
  const quickMessages = locale === "uz"
    ? ["Kerakli sana bo‘shmi?", "Narxga nimalar kiradi?", "Yakuniy narxni ayting"]
    : ["Свободна ли нужная дата?", "Что входит в стоимость?", "Подскажите итоговую цену"];
  const [selectedId, setSelectedId] = useState(initialConversationId);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isSupplier = state.role === "supplier" || state.role === "supplier_planner";
  const accountKey = state.accountName.trim().toLocaleLowerCase();
  const visibleConversations = useMemo(
    () => state.conversations
      .filter((conversation) => isSupplier
        ? conversation.supplierId === supplierId
        : conversation.clientAccount === accountKey)
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt)),
    [accountKey, isSupplier, state.conversations],
  );
  const routeConversation = selectedId
    ? visibleConversations.find((conversation) => conversation.id === selectedId)
    : undefined;
  const serviceConversation = initialServiceId
    ? visibleConversations.find((conversation) => conversation.serviceId === initialServiceId)
    : undefined;
  const activeConversation = routeConversation
    ?? serviceConversation
    ?? (!initialServiceId ? visibleConversations[0] : undefined);
  const draftService = !activeConversation && initialServiceId ? getServiceById(initialServiceId) : undefined;
  const activeService = activeConversation ? getServiceById(activeConversation.serviceId) : draftService;
  const activeSupplier = activeService ? getSupplierById(activeService.supplierId) : undefined;

  if (!state.signedIn) {
    const destination = `/chats${initialServiceId ? `?service=${encodeURIComponent(initialServiceId)}` : ""}`;
    return (
      <section className="panel empty-state chat-sign-in">
        <h2>{text("Войдите, чтобы написать автору предложения", "E’lon muallifiga yozish uchun kiring")}</h2>
        <p>{text("После входа откроется выбранное предложение и поле сообщения.", "Kirgandan so‘ng tanlangan taklif va xabar maydoni ochiladi.")}</p>
        <Link className="button button-primary" href={`/login?role=client&next=${encodeURIComponent(destination)}`}>{text("Войти и продолжить", "Kirish va davom etish")}</Link>
      </section>
    );
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const messageText = message.trim();
    if (messageText.length < 2) {
      setError(text("Напишите сообщение автору предложения", "E’lon muallifiga xabar yozing"));
      return;
    }
    if (activeConversation) {
      addChatMessage(activeConversation.id, isSupplier ? "supplier" : "client", messageText);
      setSelectedId(activeConversation.id);
    } else if (draftService && !isSupplier) {
      const conversationId = startConversation(draftService.id, state.accountName, messageText);
      setSelectedId(conversationId);
    } else {
      setError(text("Сначала выберите предложение", "Avval taklifni tanlang"));
      return;
    }
    setMessage("");
    setError("");
    refresh();
  }

  return (
    <section className="chat-shell">
      <aside className="chat-sidebar" aria-label={text("Список диалогов", "Suhbatlar ro‘yxati")}>
        <div className="chat-sidebar-heading">
          <div><p className="eyebrow">{text("Сообщения", "Xabarlar")}</p><h2>{text("Диалоги", "Suhbatlar")}</h2></div>
          {!isSupplier ? <Link className="button button-secondary button-small" href="/catalog">{text("Каталог", "Katalog")}</Link> : null}
        </div>
        <div className="chat-list">
          {visibleConversations.map((conversation) => {
            const service = getServiceById(conversation.serviceId);
            const supplier = getSupplierById(conversation.supplierId);
            const lastMessage = conversation.messages.at(-1);
            const active = activeConversation?.id === conversation.id;
            return (
              <button
                className={`chat-list-item ${active ? "active" : ""}`}
                type="button"
                key={conversation.id}
                onClick={() => setSelectedId(conversation.id)}
              >
                <span className="chat-avatar" aria-hidden="true">{isSupplier ? conversation.clientName.slice(0, 1).toUpperCase() : supplier?.name.slice(0, 1)}</span>
                <span>
                  <strong>{isSupplier ? conversation.clientName : supplier?.name}</strong>
                  <small>{service?.title}</small>
                  <small>{lastMessage?.text}</small>
                </span>
                <time>{formatDateTime(conversation.updatedAt, locale)}</time>
              </button>
            );
          })}
          {!visibleConversations.length ? <div className="chat-list-empty">{text("Здесь появятся ваши диалоги.", "Suhbatlaringiz shu yerda paydo bo‘ladi.")}</div> : null}
        </div>
      </aside>

      <div className="chat-conversation">
        {activeService && activeSupplier ? (
          <>
            <header className="chat-header">
              <div className="chat-avatar" aria-hidden="true">{isSupplier && activeConversation ? activeConversation.clientName.slice(0, 1).toUpperCase() : activeSupplier.name.slice(0, 1)}</div>
              <div>
                <strong>{isSupplier && activeConversation ? activeConversation.clientName : activeSupplier.name}</strong>
                <span>{activeService.title}</span>
              </div>
              <Link className="button button-secondary button-small" href={`/suppliers/${activeSupplier.slug}`}>{text("Карточка", "Karta")}</Link>
            </header>

            <div className="chat-messages" aria-live="polite">
              {activeConversation?.messages.map((item) => {
                const ownMessage = isSupplier ? item.sender === "supplier" : item.sender === "client";
                return (
                  <div className={`chat-message ${ownMessage ? "own" : ""}`} key={item.id}>
                    <p>{item.text}</p>
                    <time>{formatDateTime(item.createdAt, locale)}</time>
                  </div>
                );
              })}
              {!activeConversation ? (
                <div className="chat-welcome">
                  <span className="chat-avatar" aria-hidden="true">{activeSupplier.name.slice(0, 1)}</span>
                  <h3>{text("Напишите", "Yozing")}: {activeSupplier.name}</h3>
                  <p>{text("Уточните свободную дату, наличие, состав предложения или итоговую цену.", "Bo‘sh sana, mavjudlik, taklif tarkibi yoki yakuniy narxni aniqlashtiring.")}</p>
                </div>
              ) : null}
            </div>

            {!isSupplier && (!activeConversation || activeConversation.messages.length < 2) ? (
              <div className="quick-messages" aria-label={text("Быстрые вопросы", "Tezkor savollar")}>
                {quickMessages.map((text) => <button type="button" key={text} onClick={() => setMessage(text)}>{text}</button>)}
              </div>
            ) : null}

            <form className="chat-composer" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="chat-message">{text("Сообщение", "Xabar")}</label>
              <textarea
                id="chat-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={isSupplier ? text("Напишите клиенту…", "Mijozga yozing…") : text("Напишите автору…", "Muallifga yozing…")}
                rows={2}
              />
              <button className="button button-primary" type="submit">{text("Отправить", "Yuborish")}</button>
              {error ? <span className="error-text small" role="alert">{error}</span> : null}
              <small>{text("Сообщение не подтверждает бронь, наличие или оплату.", "Xabar bron, mavjudlik yoki to‘lovni tasdiqlamaydi.")}</small>
            </form>
          </>
        ) : (
          <div className="chat-welcome chat-welcome-empty">
            <h2>{text("Выберите предложение", "Taklifni tanlang")}</h2>
            <p>{text("Откройте каталог и нажмите «Написать автору».", "Katalogni oching va «Muallifga yozish» tugmasini bosing.")}</p>
            <Link className="button button-primary" href="/catalog">{text("Открыть каталог", "Katalogni ochish")}</Link>
          </div>
        )}
      </div>
    </section>
  );
}

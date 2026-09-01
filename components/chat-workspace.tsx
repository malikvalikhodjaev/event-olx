"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { addChatMessage, startConversation } from "@/lib/demo-store";
import { getServiceById, getSupplierById } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";

const supplierId = "supplier-silk-road";
const quickMessages = [
  "Свободна ли нужная дата?",
  "Что входит в стоимость?",
  "Подскажите итоговую цену",
];

export function ChatWorkspace({
  initialServiceId = "",
  initialConversationId = "",
}: {
  initialServiceId?: string;
  initialConversationId?: string;
}) {
  const { state, refresh } = useDemoSession();
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
        <h2>Войдите, чтобы написать поставщику</h2>
        <p>После входа откроется выбранное предложение и поле сообщения.</p>
        <Link className="button button-primary" href={`/login?role=client&next=${encodeURIComponent(destination)}`}>Войти и продолжить</Link>
      </section>
    );
  }

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = message.trim();
    if (text.length < 2) {
      setError("Напишите сообщение поставщику");
      return;
    }
    if (activeConversation) {
      addChatMessage(activeConversation.id, isSupplier ? "supplier" : "client", text);
      setSelectedId(activeConversation.id);
    } else if (draftService && !isSupplier) {
      const conversationId = startConversation(draftService.id, state.accountName, text);
      setSelectedId(conversationId);
    } else {
      setError("Сначала выберите предложение");
      return;
    }
    setMessage("");
    setError("");
    refresh();
  }

  return (
    <section className="chat-shell">
      <aside className="chat-sidebar" aria-label="Список диалогов">
        <div className="chat-sidebar-heading">
          <div><p className="eyebrow">Сообщения</p><h2>Диалоги</h2></div>
          {!isSupplier ? <Link className="button button-secondary button-small" href="/catalog">Каталог</Link> : null}
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
                <time>{formatDateTime(conversation.updatedAt)}</time>
              </button>
            );
          })}
          {!visibleConversations.length ? <div className="chat-list-empty">Здесь появятся ваши диалоги.</div> : null}
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
              <Link className="button button-secondary button-small" href={`/suppliers/${activeSupplier.slug}`}>Карточка</Link>
            </header>

            <div className="chat-messages" aria-live="polite">
              {activeConversation?.messages.map((item) => {
                const ownMessage = isSupplier ? item.sender === "supplier" : item.sender === "client";
                return (
                  <div className={`chat-message ${ownMessage ? "own" : ""}`} key={item.id}>
                    <p>{item.text}</p>
                    <time>{formatDateTime(item.createdAt)}</time>
                  </div>
                );
              })}
              {!activeConversation ? (
                <div className="chat-welcome">
                  <span className="chat-avatar" aria-hidden="true">{activeSupplier.name.slice(0, 1)}</span>
                  <h3>Напишите {activeSupplier.name}</h3>
                  <p>Уточните свободную дату, наличие, состав предложения или итоговую цену.</p>
                </div>
              ) : null}
            </div>

            {!isSupplier && (!activeConversation || activeConversation.messages.length < 2) ? (
              <div className="quick-messages" aria-label="Быстрые вопросы">
                {quickMessages.map((text) => <button type="button" key={text} onClick={() => setMessage(text)}>{text}</button>)}
              </div>
            ) : null}

            <form className="chat-composer" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="chat-message">Сообщение</label>
              <textarea
                id="chat-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={isSupplier ? "Напишите клиенту…" : "Напишите поставщику…"}
                rows={2}
              />
              <button className="button button-primary" type="submit">Отправить</button>
              {error ? <span className="error-text small" role="alert">{error}</span> : null}
              <small>Сообщение не подтверждает бронь, наличие или оплату.</small>
            </form>
          </>
        ) : (
          <div className="chat-welcome chat-welcome-empty">
            <h2>Выберите предложение</h2>
            <p>Откройте каталог и нажмите «Написать поставщику».</p>
            <Link className="button button-primary" href="/catalog">Открыть каталог</Link>
          </div>
        )}
      </div>
    </section>
  );
}

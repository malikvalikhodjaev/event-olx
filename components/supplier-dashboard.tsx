"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { StatusBadge } from "@/components/status-badge";
import { services, getServiceById } from "@/lib/demo-data";
import { formatDateTime, formatMoney } from "@/lib/format";
import { useLocale } from "@/components/locale-provider";
import { cityName, offerKindLabelsByLocale, priceUnit, serviceTitle } from "@/lib/i18n";

const supplierId = "supplier-silk-road";

export function SupplierDashboard() {
  const { state } = useDemoSession();
  const { locale, text } = useLocale();
  const conversations = state.conversations
    .filter((conversation) => conversation.supplierId === supplierId)
    .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  const ownServices = [...services, ...state.importedServices].filter((service) => service.supplierId === supplierId);
  const waitingForReply = conversations.filter((conversation) => !conversation.firstSupplierResponseAt).length;

  return (
    <div className="grid" style={{ gap: 20 }}>
      <section className="grid grid-3">
        <article className="card"><p className="eyebrow">{text("Ждут ответа", "Javob kutmoqda")}</p><h2>{waitingForReply}</h2><span className="muted small">{text("Откройте чат и ответьте клиенту", "Suhbatni ochib, mijozga javob bering")}</span></article>
        <article className="card"><p className="eyebrow">{text("Предложения", "Takliflar")}</p><h2>{ownServices.length}</h2><span className="muted small">{ownServices.filter((item) => item.published).length} {text("опубликовано", "e’lon qilingan")}</span></article>
        <article className="card"><p className="eyebrow">{text("Не опубликованы", "E’lon qilinmagan")}</p><h2>{state.importedServices.length}</h2><span className="muted small">{text("Станут видны клиентам после проверки", "Tekshiruvdan so‘ng mijozlarga ko‘rinadi")}</span></article>
      </section>

      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">{text("Сообщения клиентов", "Mijozlar xabarlari")}</p><h2>{text("Последние диалоги", "So‘nggi suhbatlar")}</h2></div><Link className="button button-primary button-small" href="/chats">{text("Открыть все чаты", "Barcha suhbatlarni ochish")}</Link></div>
        {conversations.length ? conversations.map((conversation) => {
          const lastMessage = conversation.messages.at(-1);
          return (
            <article className="conversation-row" key={conversation.id}>
              <div>
                <strong>{(() => { const service = getServiceById(conversation.serviceId); return service ? serviceTitle(locale, service) : text("Предложение", "Taklif"); })()}</strong><br />
                <span className="small muted">{conversation.clientName} · {formatDateTime(conversation.updatedAt, locale)}</span><br />
                <span className="small">{lastMessage?.text}</span>
              </div>
              <div><StatusBadge tone={conversation.firstSupplierResponseAt ? "success" : "warning"}>{conversation.firstSupplierResponseAt ? text("Ответили", "Javob berildi") : text("Ждёт ответа", "Javob kutmoqda")}</StatusBadge></div>
              <Link className="button button-secondary button-small" href={`/chats?conversation=${conversation.id}`}>{text("Открыть чат", "Suhbatni ochish")}</Link>
            </article>
          );
        }) : <div className="empty-state">{text("Сообщений от клиентов пока нет.", "Mijozlardan xabarlar hozircha yo‘q.")}</div>}
      </section>

      <section className="panel">
        <div className="toolbar"><div><p className="eyebrow">{text("Ваш каталог", "Katalogingiz")}</p><h2>{text("Мои предложения", "Mening takliflarim")}</h2></div><Link className="button button-primary" href="/supplier/import">{text("Загрузить цены из Excel", "Narxlarni Excel’dan yuklash")}</Link></div>
        <div className="table-wrap"><table><thead><tr><th>{text("Предложение", "Taklif")}</th><th>{text("Формат", "Shakl")}</th><th>{text("Цена от", "Boshlang‘ich narx")}</th><th>{text("Статус", "Holat")}</th><th>{text("Обновлено", "Yangilangan")}</th><th>{text("Страница", "Sahifa")}</th></tr></thead><tbody>{ownServices.map((service) => (
          <tr key={service.id}><td><strong>{serviceTitle(locale, service)}</strong><br /><span className="muted">{service.sku} · {cityName(locale, service.city)}</span></td><td>{offerKindLabelsByLocale[locale][service.offerKind]}</td><td>{formatMoney(service.priceFrom, locale)} · {priceUnit(locale, service.priceUnit)}</td><td><StatusBadge tone={service.published ? "success" : "warning"}>{service.published ? text("Опубликовано", "E’lon qilingan") : text("Черновик", "Qoralama")}</StatusBadge></td><td>{formatDateTime(service.updatedAt, locale)}</td><td><Link className="button button-secondary button-small" href={`/offers/${service.id}${service.published ? "" : "?preview=1"}`} target="_blank" rel="noreferrer">{service.published ? text("Посмотреть как клиент", "Mijoz sifatida ko‘rish") : text("Предпросмотр", "Ko‘rib chiqish")}</Link></td></tr>
        ))}</tbody></table></div>
      </section>

      <section className="panel">
        <p className="eyebrow">{text("Договорённости", "Kelishuvlar")}</p><h2>{text("Что подтвердить в чате", "Suhbatda nimani tasdiqlash kerak")}</h2>
        <div className="callout callout-warning">{text("Переписка не означает бронь. Явно подтвердите клиенту дату, итоговую цену, состав предложения и способ оплаты.", "Yozishma bron degani emas. Mijozga sana, yakuniy narx, taklif tarkibi va to‘lov usulini aniq tasdiqlang.")}</div>
        <div className="metric-list">
          <div className="metric"><span>{text("Дата и время", "Sana va vaqt")}</span><strong>{text("Подтвердить", "Tasdiqlash")}</strong></div>
          <div className="metric"><span>{text("Итоговая цена", "Yakuniy narx")}</span><strong>{text("Зафиксировать", "Qayd etish")}</strong></div>
          <div className="metric"><span>{text("Что входит", "Nimalar kiradi")}</span><strong>{text("Перечислить", "Sanab o‘tish")}</strong></div>
          <div className="metric"><span>{text("Бронь и оплата", "Bron va to‘lov")}</span><strong>{text("Согласовать отдельно", "Alohida kelishish")}</strong></div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { getServiceById, services } from "@/lib/demo-data";
import { useLocale } from "@/components/locale-provider";
import { LanguageSwitcher } from "@/components/language-switcher";
import { serviceTitle } from "@/lib/i18n";

const supplierId = "supplier-silk-road";

export function MobileSupplierHome() {
  const { state } = useDemoSession();
  const { locale, text } = useLocale();
  const isSupplier = state.role === "supplier" || state.role === "supplier_planner";
  const ownServices = services.filter((service) => service.supplierId === supplierId);
  const conversations = state.conversations.filter((conversation) => conversation.supplierId === supplierId);
  const unanswered = conversations.filter((conversation) => !conversation.firstSupplierResponseAt).length;

  return (
    <div className="mobile-app-home mobile-supplier-home">
      <header className="mobile-app-topbar">
        <Link href="/mobile_app" className="mobile-app-brand" aria-label={text("Marosim — мобильная главная", "Marosim — mobil bosh sahifa")}>
          <span className="brand-mark">M</span>
          <strong>Marosim</strong>
        </Link>
        <div className="mobile-app-topbar-actions">
          <LanguageSwitcher />
          <Link className="mobile-mode-switch" href="/mobile_app">{text("Для клиентов", "Mijozlar uchun")}</Link>
        </div>
      </header>

      {!state.signedIn || !isSupplier ? (
        <section className="mobile-supplier-welcome">
          <span className="mobile-supplier-symbol" aria-hidden="true">↗</span>
          <p className="eyebrow">{text("Мобильный раздел автора", "Muallifning mobil bo‘limi")}</p>
          <h1>{text("Получайте обращения и управляйте предложениями", "Murojaatlarni oling va takliflarni boshqaring")}</h1>
          <p>{text("Добавляйте услуги и товары, загружайте прайс и отвечайте клиентам с телефона.", "Xizmat va mahsulotlarni qo‘shing, narxlarni yuklang va mijozlarga telefondan javob bering.")}</p>
          <div className="actions">
            <Link
              className="button supplier-acquisition-button"
              href={state.signedIn ? "/onboarding?intent=supplier&next=/mobile_app/supplier" : "/login?role=supplier&next=/mobile_app/supplier"}
            >
              {state.signedIn ? text("Перейти в профиль автора", "Muallif profiliga o‘tish") : text("Войти как автор предложения", "E’lon muallifi sifatida kirish")}
            </Link>
          </div>
          <div className="mobile-supplier-benefits">
            <div><strong>{text("Предложения", "Takliflar")}</strong><span>{text("Редактирование и публикация", "Tahrirlash va e’lon qilish")}</span></div>
            <div><strong>{text("Прайс", "Narxlar")}</strong><span>{text("Загрузка из Excel", "Excel’dan yuklash")}</span></div>
            <div><strong>{text("Сообщения", "Xabarlar")}</strong><span>{text("Обращения клиентов", "Mijozlar murojaatlari")}</span></div>
          </div>
        </section>
      ) : (
        <>
          <section className="mobile-supplier-dashboard" aria-labelledby="supplier-mobile-title">
            <p className="eyebrow">{text("Рабочий раздел", "Ish bo‘limi")}</p>
            <h1 id="supplier-mobile-title">{text("Добрый день!", "Assalomu alaykum!")}</h1>
            <p>{text("Главное по вашим предложениям и обращениям.", "Taklif va murojaatlaringiz bo‘yicha asosiy ma’lumotlar.")}</p>
            <div className="mobile-supplier-metrics">
              <Link href="/supplier"><strong>{ownServices.length}</strong><span>{text("предложения", "taklif")}</span></Link>
              <Link href="/chats"><strong>{conversations.length}</strong><span>{text("обращения", "murojaat")}</span></Link>
              <Link className={unanswered ? "needs-attention" : ""} href="/chats"><strong>{unanswered}</strong><span>{text("ждут ответа", "javob kutmoqda")}</span></Link>
            </div>
          </section>

          <section className="mobile-app-section" aria-labelledby="supplier-actions-title">
            <div className="mobile-section-heading"><h2 id="supplier-actions-title">{text("Быстрые действия", "Tezkor amallar")}</h2></div>
            <div className="mobile-supplier-actions">
              <Link href="/supplier"><span aria-hidden="true">＋</span><strong>{text("Предложения", "Takliflar")}</strong><small>{text("Добавить или изменить", "Qo‘shish yoki o‘zgartirish")}</small></Link>
              <Link href="/supplier/import"><span aria-hidden="true">⇧</span><strong>{text("Загрузить прайс", "Narxlarni yuklash")}</strong><small>Excel yoki CSV</small></Link>
              <Link href="/chats"><span aria-hidden="true">↗</span><strong>{text("Ответить клиентам", "Mijozlarga javob berish")}</strong><small>{unanswered ? `${unanswered} ${text("без ответа", "javobsiz")}` : text("Новых нет", "Yangilari yo‘q")}</small></Link>
            </div>
          </section>

          <section className="mobile-app-section" aria-labelledby="supplier-inbox-title">
            <div className="mobile-section-heading">
              <h2 id="supplier-inbox-title">{text("Последние обращения", "So‘nggi murojaatlar")}</h2>
              <Link href="/chats">{text("Все сообщения", "Barcha xabarlar")}</Link>
            </div>
            <div className="mobile-supplier-inbox">
              {conversations.slice(0, 3).map((conversation) => {
                const service = getServiceById(conversation.serviceId);
                const lastMessage = conversation.messages.at(-1);
                return (
                  <Link href={`/chats?conversation=${conversation.id}`} key={conversation.id}>
                    <span className="chat-avatar" aria-hidden="true">{conversation.clientName.slice(0, 1)}</span>
                    <span><strong>{conversation.clientName}</strong><small>{service ? serviceTitle(locale, service) : ""}</small><em>{lastMessage?.text}</em></span>
                    {!conversation.firstSupplierResponseAt ? <b>{text("Новый", "Yangi")}</b> : <span aria-hidden="true">›</span>}
                  </Link>
                );
              })}
              {!conversations.length ? <p className="empty-state">{text("Новых обращений пока нет.", "Yangi murojaatlar hozircha yo‘q.")}</p> : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

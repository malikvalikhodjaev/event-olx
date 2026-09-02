"use client";

import Link from "next/link";
import { useDemoSession } from "@/components/demo-session";
import { getServiceById, services } from "@/lib/demo-data";

const supplierId = "supplier-silk-road";

export function MobileSupplierHome() {
  const { state } = useDemoSession();
  const isSupplier = state.role === "supplier" || state.role === "supplier_planner";
  const ownServices = services.filter((service) => service.supplierId === supplierId);
  const conversations = state.conversations.filter((conversation) => conversation.supplierId === supplierId);
  const unanswered = conversations.filter((conversation) => !conversation.firstSupplierResponseAt).length;

  return (
    <div className="mobile-app-home mobile-supplier-home">
      <header className="mobile-app-topbar">
        <Link href="/mobile_app" className="mobile-app-brand" aria-label="Marosim — мобильная главная">
          <span className="brand-mark">M</span>
          <strong>Marosim</strong>
        </Link>
        <Link className="mobile-mode-switch" href="/mobile_app">Для клиентов</Link>
      </header>

      {!state.signedIn || !isSupplier ? (
        <section className="mobile-supplier-welcome">
          <span className="mobile-supplier-symbol" aria-hidden="true">↗</span>
          <p className="eyebrow">Мобильный раздел поставщика</p>
          <h1>Получайте обращения и управляйте предложениями</h1>
          <p>Добавляйте услуги и товары, загружайте прайс и отвечайте клиентам с телефона.</p>
          <div className="actions">
            <Link
              className="button supplier-acquisition-button"
              href={state.signedIn ? "/onboarding?intent=supplier&next=/mobile_app/supplier" : "/login?role=supplier&next=/mobile_app/supplier"}
            >
              {state.signedIn ? "Перейти в профиль поставщика" : "Войти как поставщик"}
            </Link>
          </div>
          <div className="mobile-supplier-benefits">
            <div><strong>Предложения</strong><span>Редактирование и публикация</span></div>
            <div><strong>Прайс</strong><span>Загрузка из Excel</span></div>
            <div><strong>Сообщения</strong><span>Обращения клиентов</span></div>
          </div>
        </section>
      ) : (
        <>
          <section className="mobile-supplier-dashboard" aria-labelledby="supplier-mobile-title">
            <p className="eyebrow">Рабочий раздел</p>
            <h1 id="supplier-mobile-title">Добрый день!</h1>
            <p>Главное по вашим предложениям и обращениям.</p>
            <div className="mobile-supplier-metrics">
              <Link href="/supplier"><strong>{ownServices.length}</strong><span>предложения</span></Link>
              <Link href="/chats"><strong>{conversations.length}</strong><span>обращения</span></Link>
              <Link className={unanswered ? "needs-attention" : ""} href="/chats"><strong>{unanswered}</strong><span>ждут ответа</span></Link>
            </div>
          </section>

          <section className="mobile-app-section" aria-labelledby="supplier-actions-title">
            <div className="mobile-section-heading"><h2 id="supplier-actions-title">Быстрые действия</h2></div>
            <div className="mobile-supplier-actions">
              <Link href="/supplier"><span aria-hidden="true">＋</span><strong>Предложения</strong><small>Добавить или изменить</small></Link>
              <Link href="/supplier/import"><span aria-hidden="true">⇧</span><strong>Загрузить прайс</strong><small>Excel или CSV</small></Link>
              <Link href="/chats"><span aria-hidden="true">↗</span><strong>Ответить клиентам</strong><small>{unanswered ? `${unanswered} без ответа` : "Новых нет"}</small></Link>
            </div>
          </section>

          <section className="mobile-app-section" aria-labelledby="supplier-inbox-title">
            <div className="mobile-section-heading">
              <h2 id="supplier-inbox-title">Последние обращения</h2>
              <Link href="/chats">Все сообщения</Link>
            </div>
            <div className="mobile-supplier-inbox">
              {conversations.slice(0, 3).map((conversation) => {
                const service = getServiceById(conversation.serviceId);
                const lastMessage = conversation.messages.at(-1);
                return (
                  <Link href={`/chats?conversation=${conversation.id}`} key={conversation.id}>
                    <span className="chat-avatar" aria-hidden="true">{conversation.clientName.slice(0, 1)}</span>
                    <span><strong>{conversation.clientName}</strong><small>{service?.title}</small><em>{lastMessage?.text}</em></span>
                    {!conversation.firstSupplierResponseAt ? <b>Новый</b> : <span aria-hidden="true">›</span>}
                  </Link>
                );
              })}
              {!conversations.length ? <p className="empty-state">Новых обращений пока нет.</p> : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

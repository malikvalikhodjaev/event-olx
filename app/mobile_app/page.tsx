import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Мобильное приложение Marosim" };

export default function MobileAppPage() {
  return (
    <section className="mobile-app-page">
      <div className="mobile-app-copy">
        <p className="eyebrow">Мобильное приложение</p>
        <h1>Marosim всегда под рукой</h1>
        <p className="lead">Установите сайт на главный экран и открывайте каталог, план и сообщения как обычное приложение.</p>
        <div className="actions">
          <Link className="button button-primary" href="/catalog">Открыть каталог</Link>
          <Link className="button button-secondary" href="/planner">Перейти к плану</Link>
        </div>
        <div className="install-steps">
          <div><strong>iPhone</strong><span>Поделиться → На экран «Домой»</span></div>
          <div><strong>Android</strong><span>Меню браузера → Установить приложение</span></div>
        </div>
      </div>
      <div className="phone-preview" aria-label="Предпросмотр мобильного Marosim">
        <div className="phone-screen">
          <span className="phone-pill">Marosim</span>
          <h2>Событие начинается с выбора</h2>
          <div className="phone-card">Услуги <span>→</span></div>
          <div className="phone-card">Маркет <span>→</span></div>
          <div className="phone-card">Техника <span>→</span></div>
        </div>
      </div>
    </section>
  );
}

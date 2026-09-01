import Link from "next/link";
import Image from "next/image";
import { catalogSections } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <>
      <section className="hero hero-editorial">
        <div className="hero-stage">
          <Image
            className="hero-image"
            src="/hero-eventhub-v1.png"
            alt="Команда готовит площадку для мероприятия"
            fill
            priority
            sizes="(max-width: 720px) 100vw, 1180px"
          />
          <div className="hero-copy">
            <p className="eyebrow">Все для события — в одном месте</p>
            <h1>Найдите тех, кто сделает событие вашим</h1>
            <p className="lead">
              Сравните предложения, соберите план и отправьте поставщикам одну понятную заявку.
            </p>
            <div className="actions">
              <Link className="button button-primary hero-login" href="/login">Войти в Marosim</Link>
              <Link className="button button-secondary" href="/catalog">Смотреть каталог</Link>
            </div>
          </div>
        </div>
        <div className="hero-proof" aria-label="Принципы Marosim">
          <div><strong>Понятные цены</strong><span>Сразу видно, от какой суммы начинается предложение</span></div>
          <div><strong>Актуальные предложения</strong><span>Видно, когда поставщик обновил информацию</span></div>
          <div><strong>Заявки в одном месте</strong><span>Следите за ответами без долгих переписок</span></div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Как работает Marosim</p>
            <h2>Каждому — свой следующий шаг</h2>
          </div>
          <p>Найдите всё нужное, составьте план события или принимайте заявки от клиентов.</p>
        </div>
        <div className="grid grid-3">
          <article className="card story-card story-card-yellow">
            <div className="category-icon">♡</div>
            <h3>Клиент и организатор</h3>
            <p>План события, подборка вариантов и заявки с понятным следующим шагом.</p>
            <Link className="text-link" href="/login?role=client_planner">Войти как организатор <span aria-hidden="true">→</span></Link>
          </article>
          <article className="card story-card story-card-black">
            <div className="category-icon">↗</div>
            <h3>Поставщик</h3>
            <p>Добавляйте услуги, товары и аренду, загружайте цены из Excel и отвечайте на заявки.</p>
            <Link className="text-link" href="/login?role=supplier">Войти как поставщик <span aria-hidden="true">→</span></Link>
          </article>
          <article className="card story-card story-card-lilac">
            <div className="category-icon">✓</div>
            <h3>Администратор</h3>
            <p>Проверяйте карточки, помогайте исправлять ошибки и разбирайте жалобы.</p>
            <Link className="text-link" href="/login?role=admin">Войти как администратор <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2>Услуги, покупки и техника</h2>
          </div>
          <Link className="button button-secondary" href="/catalog">Весь каталог</Link>
        </div>
        <div className="grid grid-3">
          {catalogSections.map((section) => (
            <Link className="card card-muted category-card" href={`/catalog?section=${section.id}`} key={section.id}>
              <span className="category-icon">{section.icon}</span>
              <span><strong>{section.name}</strong><br /><small className="muted">{section.description}</small></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

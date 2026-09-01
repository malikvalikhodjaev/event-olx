import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/demo-data";

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
              <Link className="button button-primary" href="/catalog">Найти услугу</Link>
              <Link className="button button-secondary" href="/planner">Собрать план</Link>
            </div>
          </div>
        </div>
        <div className="hero-proof" aria-label="Принципы Marosim">
          <div><strong>Цена рядом</strong><span>Сразу виден формат расчёта</span></div>
          <div><strong>Данные свежее</strong><span>Показываем дату обновления</span></div>
          <div><strong>Заявка понятнее</strong><span>Но не выдаётся за бронь</span></div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Как работает Marosim</p>
            <h2>Каждому — свой следующий шаг</h2>
          </div>
          <p>Роли разделены по задачам, но используют один каталог, одну заявку и общую историю изменений.</p>
        </div>
        <div className="grid grid-3">
          <article className="card story-card story-card-yellow">
            <div className="category-icon">♡</div>
            <h3>Клиент и организатор</h3>
            <p>План события, подборка вариантов и заявки с понятным следующим шагом.</p>
            <Link className="text-link" href="/planner">Начать план <span aria-hidden="true">→</span></Link>
          </article>
          <article className="card story-card story-card-black">
            <div className="category-icon">↗</div>
            <h3>Поставщик услуг</h3>
            <p>Редактирование с телефона, импорт прайса из Excel и очередь целевых запросов.</p>
            <Link className="text-link" href="/supplier">Открыть кабинет <span aria-hidden="true">→</span></Link>
          </article>
          <article className="card story-card story-card-lilac">
            <div className="category-icon">✓</div>
            <h3>Администратор</h3>
            <p>Модерация, исправления, скрытие и блокировки с причиной и журналом действий.</p>
            <Link className="text-link" href="/admin">К модерации <span aria-hidden="true">→</span></Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Категории</p>
            <h2>От свадьбы до делового события</h2>
          </div>
          <Link className="button button-secondary" href="/catalog">Все услуги</Link>
        </div>
        <div className="grid grid-3">
          {categories.slice(0, 6).map((category) => (
            <Link className="card card-muted category-card" href={`/catalog?category=${category.id}`} key={category.id}>
              <span className="category-icon">{category.icon}</span>
              <span><strong>{category.name}</strong><br /><small className="muted">Смотреть предложения</small></span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

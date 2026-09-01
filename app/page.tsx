import Link from "next/link";
import { categories, services, suppliers } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-main">
          <p className="eyebrow">Мероприятие начинается с ясного следующего шага</p>
          <h1>Соберите событие без хаоса в чатах</h1>
          <p className="lead">
            Сравнивайте поставщиков, собирайте свадебный чек-лист и отправляйте нормализованные заявки — с телефона или компьютера.
          </p>
          <div className="actions">
            <Link className="button button-primary" href="/catalog">Открыть каталог</Link>
            <Link className="button button-secondary" href="/planner">Собрать свадьбу</Link>
            <Link className="button button-secondary" href="/demo">Тестовые роли</Link>
          </div>
        </div>
        <aside className="hero-aside" aria-label="Показатели демонстрационного каталога">
          <p className="eyebrow" style={{ color: "#cce1d8" }}>Первый проверяемый срез</p>
          <div className="hero-stat"><strong>{services.length}</strong><span>сравнимых услуг с форматом цены</span></div>
          <div className="hero-stat"><strong>{suppliers.length}</strong><span>поставщика с признаками свежести</span></div>
          <div className="hero-stat"><strong>{categories.length}</strong><span>категорий свадебных и бизнес-событий</span></div>
        </aside>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Основные сценарии</p>
            <h2>Один путь для каждой стороны</h2>
          </div>
          <p>Роли разделены по задачам, но используют один каталог, одну заявку и общую историю изменений.</p>
        </div>
        <div className="grid grid-3">
          <article className="card">
            <div className="category-icon">♡</div>
            <h3>Клиент и планировщик</h3>
            <p className="muted">Чек-лист, shortlist, сравнение и заявки с понятным следующим шагом.</p>
            <Link className="button button-secondary" href="/planner">Начать план</Link>
          </article>
          <article className="card">
            <div className="category-icon">↗</div>
            <h3>Поставщик услуг</h3>
            <p className="muted">Mobile-edit, Excel-импорт и нормализованная очередь целевых запросов.</p>
            <Link className="button button-secondary" href="/supplier">Открыть кабинет</Link>
          </article>
          <article className="card">
            <div className="category-icon">✓</div>
            <h3>Администратор</h3>
            <p className="muted">Модерация, исправления, скрытие и блокировки с причиной и аудитом.</p>
            <Link className="button button-secondary" href="/admin">К модерации</Link>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Категории</p>
            <h2>От свадьбы до тренинга</h2>
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

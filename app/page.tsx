import Link from "next/link";
import Image from "next/image";
import { HomeFindButton } from "@/components/home-find-button";
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
            <p className="eyebrow">Всё для события — в одном месте</p>
            <h1>Найди всё для своего мероприятия</h1>
            <p className="lead">
              Услуги, товары и техника — с понятными ценами и прямым чатом с поставщиками.
            </p>
            <div className="hero-primary-action">
              <HomeFindButton />
              <span>Начните с каталога предложений</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Выберите свой путь</p>
            <h2>Что вы хотите сделать?</h2>
          </div>
          <p>Начните с понятного действия — роль можно изменить после входа.</p>
        </div>
        <div className="grid grid-2 identity-grid">
          <article className="card story-card story-card-yellow">
            <div className="category-icon">♡</div>
            <h3>Я хочу найти всё для события</h3>
            <p>Подобрать услуги, купить нужные вещи, арендовать технику и написать поставщикам.</p>
            <Link className="text-link" href="/login?role=client&next=/catalog">Начать поиск <span aria-hidden="true">→</span></Link>
          </article>
          <article className="card story-card story-card-black">
            <div className="category-icon">↗</div>
            <h3>Я предоставляю услуги или продаю товары</h3>
            <p>Разместить предложения, загрузить цены и отвечать клиентам в чате.</p>
            <Link className="text-link" href="/login?role=supplier&next=/supplier">Разместить предложение <span aria-hidden="true">→</span></Link>
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

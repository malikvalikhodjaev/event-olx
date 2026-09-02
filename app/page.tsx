import Link from "next/link";
import Image from "next/image";
import { HomeSearch } from "@/components/home-search";
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
            <p className="eyebrow">Маросим для клиентов</p>
            <h1>Найдите всё для своего мероприятия</h1>
            <p className="lead">
              Опишите, что вам нужно. Сравните предложения и сразу напишите подходящему поставщику.
            </p>
            <HomeSearch />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Каталог</p>
            <h2>С чего начать поиск?</h2>
          </div>
          <p>Выберите раздел или найдите конкретное предложение через строку поиска.</p>
        </div>
        <div className="grid grid-3">
          {catalogSections.map((section) => (
            <Link className="card card-muted category-card" href={`/catalog?section=${section.id}`} key={section.id}>
              <span className="category-icon">{section.icon}</span>
              <span><strong>{section.name}</strong><br /><small className="muted">{section.description}</small></span>
            </Link>
          ))}
        </div>
        <div className="actions catalog-primary-action">
          <Link className="button button-primary" href="/catalog">Открыть весь каталог</Link>
        </div>
      </section>

      <section className="supplier-acquisition" aria-labelledby="supplier-acquisition-title">
        <div>
          <p className="eyebrow">Для поставщиков</p>
          <h2 id="supplier-acquisition-title">Предоставляете услуги или продаёте товары?</h2>
          <p>Разместите предложения в Маросим, загрузите цены и получайте обращения клиентов в чате.</p>
        </div>
        <Link className="button supplier-acquisition-button" href="/login?role=supplier&next=/supplier">Стать поставщиком</Link>
      </section>
    </>
  );
}

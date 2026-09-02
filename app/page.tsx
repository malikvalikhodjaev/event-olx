"use client";

import Link from "next/link";
import Image from "next/image";
import { HomeSearch } from "@/components/home-search";
import { catalogSections } from "@/lib/demo-data";
import { useLocale } from "@/components/locale-provider";
import { catalogSectionsUz } from "@/lib/i18n";

export default function HomePage() {
  const { locale, text } = useLocale();

  return (
    <>
      <section className="hero hero-editorial">
        <div className="hero-stage">
          <Image
            className="hero-image"
            src="/hero-eventhub-v1.png"
            alt={text("Команда готовит площадку для мероприятия", "Jamoa tadbir joyini tayyorlamoqda")}
            fill
            priority
            sizes="(max-width: 720px) 100vw, 1180px"
          />
          <div className="hero-copy">
            <p className="eyebrow">{text("Маросим для клиентов", "Marosim mijozlar uchun")}</p>
            <h1>{text("Найдите всё для своего мероприятия", "Tadbiringiz uchun hamma narsani toping")}</h1>
            <p className="lead">
              {text("Опишите, что вам нужно. Сравните предложения и сразу напишите подходящему автору.", "Nima kerakligini yozing. Takliflarni solishtiring va mos e’lon muallifiga darhol yozing.")}
            </p>
            <HomeSearch />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{text("Каталог", "Katalog")}</p>
            <h2>{text("С чего начать поиск?", "Qidirishni nimadan boshlash kerak?")}</h2>
          </div>
          <p>{text("Выберите раздел или найдите конкретное предложение через строку поиска.", "Bo‘limni tanlang yoki qidiruv orqali aniq taklifni toping.")}</p>
        </div>
        <div className="grid grid-3">
          {catalogSections.map((section) => (
            <Link className="card card-muted category-card" href={`/catalog?section=${section.id}`} key={section.id}>
              <span className="category-icon">{section.icon}</span>
              <span><strong>{locale === "uz" ? catalogSectionsUz[section.id].name : section.name}</strong><br /><small className="muted">{locale === "uz" ? catalogSectionsUz[section.id].description : section.description}</small></span>
            </Link>
          ))}
        </div>
        <div className="actions catalog-primary-action">
          <Link className="button button-primary" href="/catalog">{text("Открыть весь каталог", "Butun katalogni ochish")}</Link>
        </div>
      </section>

      <section className="supplier-acquisition" aria-labelledby="supplier-acquisition-title">
        <div>
          <p className="eyebrow">{text("Для авторов предложений", "E’lon mualliflari uchun")}</p>
          <h2 id="supplier-acquisition-title">{text("Предлагаете услуги или товары?", "Xizmat yoki mahsulot taklif qilasizmi?")}</h2>
          <p>{text("Разместите предложения в Маросим, загрузите цены и получайте обращения клиентов в чате.", "Marosim’da e’lon joylashtiring, narxlarni yuklang va mijozlardan xabar oling.")}</p>
        </div>
        <Link className="button supplier-acquisition-button" href="/login?role=supplier&next=/supplier">{text("Разместить предложение", "E’lon joylashtirish")}</Link>
      </section>
    </>
  );
}

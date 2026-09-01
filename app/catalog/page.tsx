import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";

export const metadata: Metadata = { title: "Каталог услуг" };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Каталог Marosim</p>
        <h1>Сравнимые услуги для события</h1>
        <p className="lead">Фильтруйте по категории и городу. Свежесть данных и проверяемые сигналы показаны отдельно от будущего рейтинга.</p>
      </header>
      <CatalogExplorer initialCategory={params.category ?? ""} />
    </>
  );
}

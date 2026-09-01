import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";

export const metadata: Metadata = { title: "Каталог услуг" };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Каталог Marosim</p>
        <h1>Услуги для вашего события</h1>
        <p className="lead">Выберите категорию и город. На карточке видно цену, поставщика и дату последнего обновления.</p>
      </header>
      <CatalogExplorer initialCategory={params.category ?? ""} />
    </>
  );
}

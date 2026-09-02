import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";

export const metadata: Metadata = { title: "Каталог" };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; section?: string; kind?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Каталог Marosim</p>
        <h1>Всё для вашего события</h1>
        <p className="lead">Найдите услугу, купите нужные вещи или арендуйте технику. На карточке видно цену, поставщика и дату обновления.</p>
      </header>
      <CatalogExplorer initialQuery={params.q ?? ""} initialCategory={params.category ?? ""} initialSection={params.section ?? ""} initialKind={params.kind ?? ""} />
    </>
  );
}

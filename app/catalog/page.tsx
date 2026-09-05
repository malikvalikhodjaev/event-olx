import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { LocalizedText } from "@/components/locale-provider";

export const metadata: Metadata = { title: "Каталог" };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; section?: string; kind?: string; event?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow"><LocalizedText ru="Каталог Marosim" uz="Marosim katalogi" /></p>
        <h1><LocalizedText ru="Всё для вашего события" uz="Tadbiringiz uchun hamma narsa" /></h1>
        <p className="lead"><LocalizedText ru="Найдите услугу, купите нужные вещи или арендуйте технику. В карточке видны цена, автор предложения и дата обновления." uz="Xizmat toping, kerakli buyumlarni sotib oling yoki texnikani ijaraga oling. Kartada narx, e’lon muallifi va yangilangan sana ko‘rsatiladi." /></p>
      </header>
      <CatalogExplorer initialQuery={params.q ?? ""} initialCategory={params.category ?? ""} initialSection={params.section ?? ""} initialKind={params.kind ?? ""} initialEvent={params.event ?? ""} />
    </>
  );
}

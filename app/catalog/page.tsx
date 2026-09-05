import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { LocalizedText } from "@/components/locale-provider";

export const metadata: Metadata = { title: "Каталог" };

export default function CatalogPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow"><LocalizedText ru="Каталог Marosim" uz="Marosim katalogi" /></p>
        <h1><LocalizedText ru="Всё для вашего события" uz="Tadbiringiz uchun hamma narsa" /></h1>
        <p className="lead"><LocalizedText ru="Найдите услугу, купите нужные вещи или арендуйте технику. В карточке видны цена, автор предложения и дата обновления." uz="Xizmat toping, kerakli buyumlarni sotib oling yoki texnikani ijaraga oling. Kartada narx, e’lon muallifi va yangilangan sana ko‘rsatiladi." /></p>
      </header>
      <Suspense fallback={<div className="panel" aria-busy="true">Загружаем каталог…</div>}>
        <CatalogExplorer />
      </Suspense>
    </>
  );
}

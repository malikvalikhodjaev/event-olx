import type { Metadata } from "next";
import { SavedOffers } from "@/components/saved-offers";

export const metadata: Metadata = { title: "Сохранённые" };

export default function SavedPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Ваш список</p>
        <h1>Сохранённые</h1>
        <p className="lead">Соберите здесь подходящие услуги, товары и технику, чтобы сравнить их и написать поставщикам позже.</p>
      </header>
      <SavedOffers />
    </>
  );
}

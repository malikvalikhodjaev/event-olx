import type { Metadata } from "next";
import { SavedOffers } from "@/components/saved-offers";
import { LocalizedText } from "@/components/locale-provider";

export const metadata: Metadata = { title: "Сохранённые" };

export default function SavedPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow"><LocalizedText ru="Ваш список" uz="Sizning ro‘yxatingiz" /></p>
        <h1><LocalizedText ru="Сохранённые" uz="Saqlanganlar" /></h1>
        <p className="lead"><LocalizedText ru="Соберите здесь подходящие услуги, товары и технику, чтобы сравнить их и позже написать авторам." uz="Mos xizmatlar, mahsulotlar va texnikani shu yerda saqlang, solishtiring va keyin mualliflarga yozing." /></p>
      </header>
      <SavedOffers />
    </>
  );
}

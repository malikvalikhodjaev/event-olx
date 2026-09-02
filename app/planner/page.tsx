import type { Metadata } from "next";
import { WeddingPlanner } from "@/components/wedding-planner";
import { LocalizedText } from "@/components/locale-provider";

export const metadata: Metadata = { title: "Планировщик свадьбы" };

export default function PlannerPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow"><LocalizedText ru="Организатор события" uz="Tadbir tashkilotchisi" /></p>
        <h1><LocalizedText ru="Соберите свадьбу по шагам" uz="To‘yni bosqichma-bosqich rejalashtiring" /></h1>
        <p className="lead"><LocalizedText ru="Отмечайте выбранные услуги и записывайте бюджет. План сохранится на этом устройстве." uz="Tanlangan xizmatlarni belgilang va budjetni yozib boring. Reja shu qurilmada saqlanadi." /></p>
      </header>
      <WeddingPlanner />
    </>
  );
}

import type { Metadata } from "next";
import { WeddingPlanner } from "@/components/wedding-planner";

export const metadata: Metadata = { title: "Планировщик свадьбы" };

export default function PlannerPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Организатор события</p>
        <h1>Соберите свадьбу по шагам</h1>
        <p className="lead">Отмечайте выбранные услуги и записывайте бюджет. План сохранится на этом устройстве.</p>
      </header>
      <WeddingPlanner />
    </>
  );
}

import type { Metadata } from "next";
import { WeddingPlanner } from "@/components/wedding-planner";

export const metadata: Metadata = { title: "Планировщик свадьбы" };

export default function PlannerPage() {
  return (
    <>
      <header className="page-intro">
        <p className="eyebrow">Планировщик клиента</p>
        <h1>Свадьба по категориям, а не по памяти</h1>
        <p className="lead">Отмечайте выбранные услуги и бюджет. Черновик сохраняется в этом браузере и не выполняет никаких оплат.</p>
      </header>
      <WeddingPlanner />
    </>
  );
}

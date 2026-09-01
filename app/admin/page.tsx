import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = { title: "Модерация" };

export default function AdminPage() {
  return <><section className="page-intro"><p className="eyebrow">Администратор платформы</p><h1>Правки, скрытие и блокировки</h1><p className="lead">Каждое действие требует основания и попадает в журнал — чтобы исправления не превращались в тихую ручную магию.</p></section><AdminDashboard /></>;
}

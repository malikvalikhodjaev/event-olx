import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = { title: "Управление" };

export default function AdminPage() {
  return <><section className="page-intro"><p className="eyebrow">Управление Marosim</p><h1>Проверка карточек и поставщиков</h1><p className="lead">Исправляйте ошибки, скрывайте неподходящие предложения и указывайте причину решения.</p></section><AdminDashboard /></>;
}

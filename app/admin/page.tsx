import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = { title: "Управление" };

export default function AdminPage() {
  return <><section className="page-intro"><p className="eyebrow">Управление Marosim</p><h1>Платформа под контролем</h1><p className="lead">Следите за активностью, диалогами и качеством каталога в одном месте.</p></section><AdminDashboard /></>;
}

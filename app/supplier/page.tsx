import type { Metadata } from "next";
import Link from "next/link";
import { SupplierDashboard } from "@/components/supplier-dashboard";

export const metadata: Metadata = { title: "Кабинет поставщика" };

export default function SupplierPage() {
  return <><section className="page-intro"><p className="eyebrow">Поставщик · Silk Road Events</p><h1>Услуги, заявки и загрузка</h1><p className="lead">Обновляйте прайс без CRM-интеграции и отвечайте клиентам в одной очереди.</p><Link className="button button-secondary" href="/demo">Как переключить роль</Link></section><SupplierDashboard /></>;
}

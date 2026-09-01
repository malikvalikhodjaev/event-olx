import type { Metadata } from "next";
import Link from "next/link";
import { SupplierDashboard } from "@/components/supplier-dashboard";

export const metadata: Metadata = { title: "Кабинет поставщика" };

export default function SupplierPage() {
  return <><section className="page-intro"><p className="eyebrow">Silk Road Events</p><h1>Предложения, заявки и свободные даты</h1><p className="lead">Добавляйте услуги, товары и аренду, обновляйте цены и отвечайте клиентам в одном месте.</p><Link className="button button-secondary" href="/account">Мой кабинет</Link></section><SupplierDashboard /></>;
}

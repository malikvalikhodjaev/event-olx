import type { Metadata } from "next";
import Link from "next/link";
import { SupplierDashboard } from "@/components/supplier-dashboard";
import { LocalizedText } from "@/components/locale-provider";

export const metadata: Metadata = { title: "Кабинет автора предложения" };

export default function SupplierPage() {
  return <><section className="page-intro"><p className="eyebrow">Silk Road Events</p><h1><LocalizedText ru="Предложения и сообщения клиентов" uz="Takliflar va mijozlar xabarlari" /></h1><p className="lead"><LocalizedText ru="Добавляйте услуги, товары и аренду, обновляйте цены и отвечайте клиентам в чатах." uz="Xizmat, mahsulot va ijarani qo‘shing, narxlarni yangilang va mijozlarga suhbatlarda javob bering." /></p><Link className="button button-secondary" href="/account"><LocalizedText ru="Мой кабинет" uz="Mening kabinetim" /></Link></section><SupplierDashboard /></>;
}

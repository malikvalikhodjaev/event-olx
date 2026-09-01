import type { Metadata } from "next";
import Link from "next/link";
import { ImportWizard } from "@/components/import-wizard";

export const metadata: Metadata = { title: "Загрузка услуг из Excel" };

export default function SupplierImportPage() {
  return <><section className="page-intro"><p className="eyebrow">Добавление услуг</p><h1>Загрузите услуги и цены из Excel</h1><p className="lead">Скачайте шаблон, заполните его своими предложениями и проверьте всё перед сохранением.</p><Link className="button button-secondary" href="/supplier">← В кабинет</Link></section><ImportWizard /></>;
}

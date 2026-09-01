import type { Metadata } from "next";
import Link from "next/link";
import { ImportWizard } from "@/components/import-wizard";

export const metadata: Metadata = { title: "Импорт услуг" };

export default function SupplierImportPage() {
  return <><section className="page-intro"><p className="eyebrow">Поставщик · массовое заполнение</p><h1>Импорт прейскуранта из Excel</h1><p className="lead">Скачайте близкий к форме шаблон, проверьте строки до записи и создайте безопасные черновики.</p><Link className="button button-secondary" href="/supplier">← В кабинет</Link></section><ImportWizard /></>;
}

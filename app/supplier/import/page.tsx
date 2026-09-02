import type { Metadata } from "next";
import Link from "next/link";
import { ImportWizard } from "@/components/import-wizard";
import { LocalizedText } from "@/components/locale-provider";

export const metadata: Metadata = { title: "Загрузка предложений из Excel" };

export default function SupplierImportPage() {
  return <><section className="page-intro"><p className="eyebrow"><LocalizedText ru="Добавление предложений" uz="Takliflarni qo‘shish" /></p><h1><LocalizedText ru="Загрузите каталог и цены из Excel" uz="Katalog va narxlarni Excel’dan yuklang" /></h1><p className="lead"><LocalizedText ru="Скачайте шаблон, добавьте свои услуги, товары или аренду и проверьте всё перед сохранением." uz="Shablonni yuklab oling, xizmat, mahsulot yoki ijarani qo‘shing va saqlashdan oldin tekshiring." /></p><Link className="button button-secondary" href="/supplier">← <LocalizedText ru="В кабинет" uz="Kabinetga" /></Link></section><ImportWizard /></>;
}

import type { Metadata } from "next";
import { RequestForm } from "@/components/request-form";

export const metadata: Metadata = { title: "Новая заявка" };

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <header className="page-intro"><p className="eyebrow">Нормализованный запрос</p><h1>Передайте поставщику нужный контекст</h1><p className="lead">Одна форма вместо серии уточняющих звонков: событие, дата, город, гости, бюджет и главный вопрос.</p></header>
      <RequestForm initialServiceId={params.service ?? ""} />
    </>
  );
}

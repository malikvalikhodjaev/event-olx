import type { Metadata } from "next";
import { RequestForm } from "@/components/request-form";

export const metadata: Metadata = { title: "Новая заявка" };

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  return (
    <>
      <header className="page-intro"><p className="eyebrow">Новая заявка</p><h1>Расскажите поставщику о событии</h1><p className="lead">Укажите дату, город, число гостей, бюджет и то, что для вас особенно важно.</p></header>
      <RequestForm initialServiceId={params.service ?? ""} />
    </>
  );
}

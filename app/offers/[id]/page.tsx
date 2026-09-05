import type { Metadata } from "next";
import { Suspense } from "react";
import { OfferDetail } from "@/components/offer-detail";
import { services } from "@/lib/demo-data";

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const service = services.find((item) => item.id === id);
  return {
    title: service?.title ?? "Предложение",
    description: service?.description,
  };
}

export default async function OfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = services.find((item) => item.id === id) ?? null;
  return <Suspense fallback={<div className="panel" aria-busy="true">Открываем предложение…</div>}><OfferDetail initialService={service} serviceId={id} preview={false} calculatorOpen={false} /></Suspense>;
}

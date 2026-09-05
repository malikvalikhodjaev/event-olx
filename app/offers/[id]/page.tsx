import type { Metadata } from "next";
import { OfferDetail } from "@/components/offer-detail";
import { services } from "@/lib/demo-data";

export function generateStaticParams() {
  return services.map((service) => ({ id: service.id }));
}

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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { id } = await params;
  const { preview } = await searchParams;
  const service = services.find((item) => item.id === id) ?? null;
  return <OfferDetail initialService={service} serviceId={id} preview={preview === "1"} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SupplierProfile } from "@/components/supplier-profile";
import { services, suppliers } from "@/lib/demo-data";

export function generateStaticParams() {
  return suppliers.map((supplier) => ({ slug: supplier.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supplier = suppliers.find((item) => item.slug === slug);
  return { title: supplier?.name ?? "Автор предложения" };
}

export default async function SupplierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supplier = suppliers.find((item) => item.slug === slug);
  if (!supplier) notFound();
  const supplierServices = services.filter((service) => service.supplierId === supplier.id && service.published);
  return <SupplierProfile supplier={supplier} services={supplierServices} />;
}

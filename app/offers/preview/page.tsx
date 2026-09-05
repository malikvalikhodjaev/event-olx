import type { Metadata } from "next";
import { Suspense } from "react";
import { OfferPreview } from "@/components/offer-preview";

export const metadata: Metadata = { title: "Предпросмотр предложения" };

export default function OfferPreviewPage() {
  return <Suspense fallback={<div className="panel" aria-busy="true">Открываем предпросмотр…</div>}><OfferPreview /></Suspense>;
}

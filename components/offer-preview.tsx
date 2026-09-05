"use client";

import { useSearchParams } from "next/navigation";
import { OfferDetail } from "@/components/offer-detail";

export function OfferPreview() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id") ?? "";
  return <OfferDetail initialService={null} serviceId={serviceId} preview calculatorOpen={false} />;
}

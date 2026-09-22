import sourceManifest from "@/docs/research/olx-verified-100.json";
import type { OfferKind, Service, Supplier } from "@/lib/types";

type SourceOffer = (typeof sourceManifest)[number];

function authorKey(url: string) {
  const match = url.match(/\/list\/user\/([^/]+)\//);
  if (match) return match[1];
  return new URL(url).hostname.replace(/^www\./, "").replace(/\W+/g, "-");
}

function supplierId(item: SourceOffer) {
  return `${item.source === "OLX.uz" ? "olx" : "site"}-${authorKey(item.authorUrl)}`;
}

function offerKind(item: SourceOffer): OfferKind {
  if (["cat-cakes", "cat-flowers", "cat-gifts-print"].includes(item.categoryId)) return "sale";
  if (["cat-event-rental", "cat-screens-stage", "cat-sound-light", "cat-tableware"].includes(item.categoryId)) return "rental";
  return "service";
}

function observedAt(item: SourceOffer) {
  return `${item.observedAt}T12:00:00+05:00`;
}

export const realCatalogServices: Service[] = sourceManifest.map((item) => ({
  id: `offer-${item.sourceId}`,
  sku: item.sku,
  supplierId: supplierId(item),
  categoryId: item.categoryId,
  title: item.title.replace(/\s+/g, " ").trim(),
  description: item.description.replace(/\s+/g, " ").trim(),
  city: item.location || "Ташкент",
  priceFrom: 0,
  priceUnit: "за услугу",
  offerKind: offerKind(item),
  imageUrl: item.localImage,
  active: true,
  published: true,
  updatedAt: observedAt(item),
  availabilityConfirmedAt: null,
  sourceUrl: item.offerUrl,
  sourceObservedAt: item.observedAt,
  sourcePlatform: item.source === "OLX.uz" ? "olx" : "web",
}));

const authorOffers = new Map<string, SourceOffer[]>();
for (const item of sourceManifest) {
  const key = authorKey(item.authorUrl);
  authorOffers.set(key, [...(authorOffers.get(key) ?? []), item]);
}

export const realCatalogSuppliers: Supplier[] = [...authorOffers.values()].map((offers) => {
  const first = offers[0];
  return {
    id: supplierId(first),
    slug: supplierId(first).toLowerCase(),
    name: first.authorName.trim(),
    city: first.location || "Ташкент",
    description: "Публичные предложения автора. Профиль пока не подтверждён в Marosim.",
    verified: false,
    verificationLabel: "Профиль не подтверждён в Marosim",
    updatedAt: observedAt(first),
    responseMedianMinutes: null,
    responseSampleSize: 0,
    portfolio: [],
    createdAt: observedAt(first),
    externalLinks: [
      { platform: "web", url: first.authorUrl },
      ...offers.flatMap((item) => [...item.description.matchAll(/https:\/\/(?:www\.)?(?:youtube\.com\/watch\?[^\s]+|youtu\.be\/[^\s]+)/g)].map((match) => ({ platform: "youtube" as const, url: match[0] }))),
    ],
    profileStatus: "unclaimed",
  };
});

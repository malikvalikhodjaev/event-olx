import sourceManifest from "@/docs/research/telegram-event-uzbekistan-selected.json";
import type { ExternalLink, OfferKind, Service, Supplier } from "@/lib/types";

const observedAt = "2026-09-23";
const observedAtWithTime = `${observedAt}T12:00:00+05:00`;

function externalLink(url: string): ExternalLink {
  const hostname = new URL(url).hostname.replace(/^www\./, "");
  return {
    platform: hostname === "t.me" ? "telegram" : hostname === "instagram.com" ? "instagram" : "web",
    url,
  };
}

export const telegramCatalogServices: Service[] = sourceManifest.map((item) => ({
  id: `offer-tg-${item.sourceId}`,
  sku: `TG-${item.sourceId}`,
  supplierId: `tg-${item.sourceId}`,
  categoryId: item.categoryId,
  title: item.title,
  description: item.description,
  city: "Ташкент",
  priceFrom: 0,
  priceUnit: "за услугу",
  offerKind: item.offerKind as OfferKind,
  imageUrl: item.imageUrl,
  active: true,
  published: true,
  updatedAt: observedAtWithTime,
  availabilityConfirmedAt: null,
  sourceUrl: `https://t.me/EventUzbekistan/${item.sourceId}`,
  sourceObservedAt: observedAt,
  sourcePlatform: "telegram",
}));

export const telegramCatalogSuppliers: Supplier[] = sourceManifest.map((item) => ({
  id: `tg-${item.sourceId}`,
  slug: `tg-${item.sourceId}`,
  name: item.authorName,
  city: "Ташкент",
  description: "Сведения из открытой публикации Event Uzbekistan. Профиль пока не подтверждён в Marosim.",
  verified: false,
  verificationLabel: "Профиль не подтверждён в Marosim",
  updatedAt: observedAtWithTime,
  responseMedianMinutes: null,
  responseSampleSize: 0,
  portfolio: [],
  createdAt: observedAtWithTime,
  externalLinks: [externalLink(item.authorUrl), externalLink(`https://t.me/EventUzbekistan/${item.sourceId}`)],
  profileStatus: "unclaimed",
}));

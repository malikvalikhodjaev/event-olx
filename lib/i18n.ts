export const supportedLocales = ["ru", "uz"] as const;

export type Locale = (typeof supportedLocales)[number];

export const localeCookieName = "marosim_locale";

export function isLocale(value: string | undefined): value is Locale {
  return supportedLocales.some((locale) => locale === value);
}

export function normalizeLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : "ru";
}

const categoryNamesUz: Record<string, string> = {
  "cat-venue": "Joylar",
  "cat-catering": "Keytering",
  "cat-photo": "Foto va video",
  "cat-decor": "Bezash va floristika",
  "cat-host": "Boshlovchilar va ko‘ngilochar dasturlar",
  "cat-music": "Musiqa va DJ",
  "cat-transport": "Transport",
  "cat-training": "Treninglar va timbilding",
  "cat-planning": "Tashkil etish va xodimlar",
  "cat-flowers": "Gullar va guldastalar",
  "cat-event-details": "Dekor va bayram uchun mayda buyumlar",
  "cat-gifts-print": "Sovg‘alar va bosma mahsulotlar",
  "cat-cakes": "Tortlar va shirinliklar stoli",
  "cat-tableware": "Idishlar va dasturxon bezagi",
  "cat-sound-light": "Ovoz va yorug‘lik",
  "cat-screens-stage": "Ekranlar va sahnalar",
  "cat-event-rental": "Mebel va chodirlar",
  "cat-power-effects": "Elektr ta’minoti va maxsus effektlar",
};

const categorySearchTermsUz: Record<string, string> = {
  "cat-venue": "joy zal restoran to‘yxona maydon",
  "cat-catering": "keytering taom ovqat menyu osh palov bufet",
  "cat-photo": "foto fotograf video videograf suratga olish",
  "cat-decor": "bezash dekor floristika fotohudud gul",
  "cat-host": "boshlovchi tamada san’atkor animator ko‘ngilochar",
  "cat-music": "musiqa dj xonanda sozanda saksofon",
  "cat-transport": "transport avtomobil mashina transfer",
  "cat-training": "trening timbilding jamoa o‘yin",
  "cat-planning": "tashkilotchi koordinator xodim menejer ro‘yxatga olish",
  "cat-flowers": "gul guldasta butonerka yaproq",
  "cat-event-details": "dekor bezak taklifnoma sham to‘qimachilik",
  "cat-gifts-print": "sovg‘a quti bosma poligrafiya taklifnoma",
  "cat-cakes": "tort shirinlik desert konfet",
  "cat-tableware": "idish tarelka stakan dasturxon servis",
  "cat-sound-light": "ovoz yorug‘lik kolonkalar mikrofon chiroq",
  "cat-screens-stage": "ekran sahna proyektor televizor led",
  "cat-event-rental": "mebel stol stul chodir ijara",
  "cat-power-effects": "generator elektr tutun maxsus effekt",
};

const cityNamesUz: Record<string, string> = {
  "Ташкент": "Toshkent",
  "Самарканд": "Samarqand",
  "Бухара": "Buxoro",
  "Фергана": "Farg‘ona",
};

const priceUnitsUz: Record<string, string> = {
  "за гостя": "har bir mehmon uchun",
  "за мероприятие": "tadbir uchun",
  "за день": "bir kun uchun",
  "за час": "bir soat uchun",
  "за комплект": "to‘plam uchun",
  "за штуку": "dona uchun",
  "за набор": "to‘plam uchun",
  "за услугу": "xizmat uchun",
  "за килограмм": "kilogramm uchun",
  "за человека": "bir kishi uchun",
  "за группу": "guruh uchun",
  "за проект": "loyiha uchun",
  "за программу": "dastur uchun",
  "за пару": "juftlik uchun",
  "за поездку": "safar uchun",
};

export const offerKindLabelsByLocale = {
  ru: { service: "Услуга", sale: "Покупка", rental: "Аренда" },
  uz: { service: "Xizmat", sale: "Sotib olish", rental: "Ijara" },
} as const;

export const catalogSectionsUz = {
  services: { name: "Xizmatlar", description: "Joylar, taom, foto-video, bezash va tashkil etish" },
  market: { name: "Market", description: "Gullar, dekor, sovg‘alar va tadbir uchun kerakli buyumlar" },
  equipment: { name: "Texnika", description: "Ovoz, yorug‘lik, ekranlar, ijara va texnik mutaxassislar" },
} as const;

export function categoryName(locale: Locale, category: { id: string; name: string }) {
  return locale === "uz" ? categoryNamesUz[category.id] ?? category.name : category.name;
}

export function categorySearchText(locale: Locale, categoryId: string) {
  return locale === "uz" ? categorySearchTermsUz[categoryId] ?? "" : "";
}

export function cityName(locale: Locale, city: string) {
  return locale === "uz" ? cityNamesUz[city] ?? city : city;
}

export function priceUnit(locale: Locale, unit: string) {
  return locale === "uz" ? priceUnitsUz[unit] ?? unit : unit;
}

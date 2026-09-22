import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const candidates = JSON.parse(readFileSync(join(root, "docs/research/olx-public-catalog-research.json"), "utf8"));
const targets = new Map(Object.entries({
  "cat-cakes": 5,
  "cat-catering": 5,
  "cat-decor": 7,
  "cat-event-details": 2,
  "cat-event-rental": 7,
  "cat-flowers": 7,
  "cat-gifts-print": 6,
  "cat-host": 8,
  "cat-marry-me": 4,
  "cat-music": 6,
  "cat-photo": 6,
  "cat-power-effects": 4,
  "cat-screens-stage": 7,
  "cat-sound-light": 7,
  "cat-tableware": 6,
  "cat-training": 2,
  "cat-transport": 6,
}));

const directOffers = [
  {
    categoryId: "cat-venue", sourceId: "seoul-hall", title: "Банкетный зал Seoul — свадьбы и мероприятия",
    description: "Банкетный зал в Ташкенте на 100–320 гостей. На сайте указаны большой зал, холл, парковка и варианты меню. Свободную дату и окончательную стоимость уточняйте у команды зала.",
    authorName: "Банкетный зал Seoul", authorUrl: "https://seoulhall.uz/", offerUrl: "https://seoulhall.uz/",
    imageUrl: "https://static.tildacdn.one/tild3461-6239-4366-a462-303730383235/9_9.jpg", location: "Ташкент", observedAt: "2026-09-23", source: "Официальный сайт",
  },
  {
    categoryId: "cat-venue", sourceId: "fillet-private", title: "Приватный банкет в ресторане Fillet",
    description: "Приватное пространство ресторана Fillet в Ташкенте до 84 гостей для свадьбы, дня рождения или корпоративного банкета. Меню и детали события согласуются с рестораном.",
    authorName: "Ресторан Fillet", authorUrl: "https://fillet-restaurant.uz/", offerUrl: "https://fillet-restaurant.uz/ru/private-dining/",
    imageUrl: "https://fillet-restaurant.uz/wp-content/uploads/2024/06/private-img2.jpg", location: "Ташкент", observedAt: "2026-09-23", source: "Официальный сайт",
  },
  {
    categoryId: "cat-venue", sourceId: "chalet-banquets", title: "Банкет в ресторане ШАЛЕ",
    description: "Ресторан ШАЛЕ предлагает несколько пространств для семейного ужина, свадьбы и корпоративного события. На сайте указаны зал на 42 места, второй этаж до 80 гостей, терраса на 68 персон и приватная зона на 12 человек.",
    authorName: "Ресторан ШАЛЕ", authorUrl: "https://chalettashkent.uz/", offerUrl: "https://chalettashkent.uz/bankety",
    imageUrl: "https://chalettashkent.uz/thumb/2/WWqmuuNWs6Rz1Th664kGdA/1920r/d/d2139eb7-98f0-4b22-9244-38f480730423.png", location: "Ташкент", observedAt: "2026-09-23", source: "Официальный сайт",
  },
  {
    categoryId: "cat-venue", sourceId: "novikov-banquets", title: "Банкетные залы Novikov Café",
    description: "Novikov Café в Ташкенте предлагает залы и террасу для семейных, деловых и частных событий. На сайте указаны пространства на 48, 50, 78 и 86 мест, а также камерные приватные зоны.",
    authorName: "Novikov Café", authorUrl: "https://novikov-cafe.uz/", offerUrl: "https://novikov-cafe.uz/bankety",
    imageUrl: "https://novikov-cafe.uz/thumb/2/fH5zxBeGB5YhwfbM2MyPbg/1280r/d/e888fb64-24e8-41bd-a04e-c8e7e6169a42.png", location: "Ташкент", observedAt: "2026-09-23", source: "Официальный сайт",
  },
  {
    categoryId: "cat-planning", sourceId: "yulchibaev-weddings", title: "Организация свадьбы — Events by Yulchibaev",
    description: "Ивент-агентство в Ташкенте организует свадьбы и выездные церемонии. На сайте показаны проекты и описан полный цикл работы: идея, сценарий, режиссура и продюсирование события.",
    authorName: "Events by Yulchibaev", authorUrl: "https://yulchibaev.uz/", offerUrl: "https://yulchibaev.uz/",
    imageUrl: "https://yulchibaev.uz/brand/og.jpg", location: "Ташкент", observedAt: "2026-09-23", source: "Официальный сайт",
  },
];

// Hand-checked exclusions: wrong domain, product instead of the searched service,
// or a near-identical repost whose author already has a stronger listing.
const exclude = new Set([
  "ID4aSyB", "ID32n1H", "ID4kxPi", "IDtxdw", "ID4thMo", "ID4fXDa",
  "ID3RLaX", "ID44xeY", "ID4scK8", "ID31BuJ", "ID4eqL3",
  "ID43J0D", "ID3PjAu", "ID38Pz8", "ID3P4vX",
]);

const selected = [];
const authorCounts = new Map();
for (const [categoryId, target] of targets) {
  const group = candidates
    .filter((item) => item.categoryId === categoryId && !exclude.has(item.sourceId))
    .filter((item) => item.title && item.description && item.authorName && item.authorUrl && item.offerUrl && item.imageUrl)
    .sort((a, b) => {
      const aScore = Math.min(a.description.length, 600) + (a.title.length < 105 ? 100 : 0) + (a.sourceId === "ID14KGI" ? 10000 : 0);
      const bScore = Math.min(b.description.length, 600) + (b.title.length < 105 ? 100 : 0) + (b.sourceId === "ID14KGI" ? 10000 : 0);
      return bScore - aScore;
    });

  const chosen = [];
  for (const item of group) {
    if (chosen.length === target) break;
    if ((authorCounts.get(item.authorUrl) ?? 0) >= 2) continue;
    chosen.push(item);
    authorCounts.set(item.authorUrl, (authorCounts.get(item.authorUrl) ?? 0) + 1);
  }
  if (chosen.length !== target) throw new Error(`${categoryId}: selected ${chosen.length} of ${target}`);
  selected.push(...chosen);
}

if (selected.length + directOffers.length !== 100 || new Set([...selected, ...directOffers].map((item) => item.offerUrl)).size !== 100) {
  throw new Error("Expected 100 unique offers");
}

const sourceManifest = [...selected, ...directOffers].map((item, index) => ({
  ...item,
  categoryId: item.categoryId === "cat-event-details" ? "cat-decor" : item.categoryId,
  sku: `MR-REAL-${String(index + 1).padStart(3, "0")}`,
  // OLX may express prices in UZS or USD; do not silently convert to UZS.
  displayPrice: null,
  localImage: `/catalog/real/${item.sourceId}.webp`,
}));

writeFileSync(join(root, "docs/research/olx-verified-100.json"), JSON.stringify(sourceManifest, null, 2) + "\n");
console.log(`Selected ${sourceManifest.length} offers from ${new Set(sourceManifest.map((item) => item.authorUrl)).size} authors`);
for (const [categoryId] of targets) {
  if (categoryId === "cat-event-details") continue;
  console.log(`${categoryId}: ${sourceManifest.filter((item) => item.categoryId === categoryId).length}`);
}
console.log(`cat-venue: ${sourceManifest.filter((item) => item.categoryId === "cat-venue").length}`);
console.log(`cat-planning: ${sourceManifest.filter((item) => item.categoryId === "cat-planning").length}`);

import { catalogSeedServices } from "@/lib/catalog-seed";
import type {
  CatalogSection,
  Conversation,
  ModerationItem,
  OfferKind,
  ServiceCategory,
  Supplier,
} from "@/lib/types";

export const catalogSections: Array<{
  id: CatalogSection;
  name: string;
  icon: string;
  description: string;
}> = [
  { id: "services", name: "Услуги", icon: "✦", description: "Площадки, еда, съёмка, оформление и организация" },
  { id: "market", name: "Маркет", icon: "◇", description: "Цветы, декор, подарки и нужные для события мелочи" },
  { id: "equipment", name: "Техника", icon: "▣", description: "Звук, свет, экраны, аренда и технические специалисты" },
];

export const offerKindLabels: Record<OfferKind, string> = {
  service: "Услуга",
  sale: "Покупка",
  rental: "Аренда",
};

export const categories: ServiceCategory[] = [
  { id: "cat-venue", slug: "venue", name: "Площадки", icon: "⌂", section: "services", requiredForWedding: true },
  { id: "cat-catering", slug: "catering", name: "Кейтеринг", icon: "◉", section: "services", requiredForWedding: true },
  { id: "cat-photo", slug: "photo-video", name: "Фото и видео", icon: "▣", section: "services", requiredForWedding: true },
  { id: "cat-decor", slug: "decor", name: "Оформление и флористика", icon: "✦", section: "services", requiredForWedding: true },
  { id: "cat-host", slug: "host", name: "Ведущие и развлечения", icon: "◍", section: "services", requiredForWedding: true },
  { id: "cat-music", slug: "music", name: "Музыка и DJ", icon: "♫", section: "services", requiredForWedding: true },
  { id: "cat-transport", slug: "transport", name: "Транспорт", icon: "◇", section: "services", requiredForWedding: false },
  { id: "cat-training", slug: "training", name: "Тренинги и тимбилдинг", icon: "△", section: "services", requiredForWedding: false },
  { id: "cat-flowers", slug: "flowers", name: "Цветы и букеты", icon: "❀", section: "market", requiredForWedding: false },
  { id: "cat-event-details", slug: "event-details", name: "Декор и праздничные мелочи", icon: "♡", section: "market", requiredForWedding: false },
  { id: "cat-gifts-print", slug: "gifts-print", name: "Подарки и полиграфия", icon: "▱", section: "market", requiredForWedding: false },
  { id: "cat-cakes", slug: "cakes", name: "Торты и сладкий стол", icon: "○", section: "market", requiredForWedding: false },
  { id: "cat-sound-light", slug: "sound-light", name: "Звук и свет", icon: "◐", section: "equipment", requiredForWedding: false },
  { id: "cat-screens-stage", slug: "screens-stage", name: "Экраны и сцены", icon: "▤", section: "equipment", requiredForWedding: false },
  { id: "cat-event-rental", slug: "event-rental", name: "Мебель и шатры", icon: "□", section: "equipment", requiredForWedding: false },
];

export const suppliers: Supplier[] = [
  {
    id: "supplier-silk-road",
    slug: "silk-road-events",
    name: "Silk Road Events",
    city: "Ташкент",
    description: "Банкетная площадка и координация камерных и больших свадеб.",
    verified: true,
    verificationLabel: "Компания проверена модератором",
    updatedAt: "2026-08-31T09:30:00+05:00",
    responseMedianMinutes: 38,
    responseSampleSize: 12,
    portfolio: ["Свадьба на 120 гостей", "Никах и семейный ужин", "Корпоративная конференция"],
    createdAt: "2026-07-06T11:20:00+05:00",
  },
  {
    id: "supplier-nur-photo",
    slug: "nur-photo-film",
    name: "Nur Photo & Film",
    city: "Ташкент",
    description: "Фото- и видеосъёмка свадеб, семейных событий и деловых мероприятий.",
    verified: true,
    verificationLabel: "Личность и портфолио проверены",
    updatedAt: "2026-08-28T16:10:00+05:00",
    responseMedianMinutes: 74,
    responseSampleSize: 8,
    portfolio: ["Wedding story", "Love story", "Business highlights"],
    createdAt: "2026-07-22T14:40:00+05:00",
  },
  {
    id: "supplier-sabo-decor",
    slug: "sabo-decor",
    name: "Sabo Decor",
    city: "Самарканд",
    description: "Современный декор, флористика и оформление фотозон.",
    verified: false,
    verificationLabel: "Проверка поставщика не завершена",
    updatedAt: "2026-06-12T11:00:00+05:00",
    responseMedianMinutes: null,
    responseSampleSize: 2,
    portfolio: ["Garden wedding", "Национальная церемония"],
    createdAt: "2026-08-12T10:15:00+05:00",
  },
  {
    id: "supplier-teamcraft",
    slug: "teamcraft-uz",
    name: "TeamCraft UZ",
    city: "Ташкент",
    description: "Фасилитация, тренинги и командные программы для компаний.",
    verified: true,
    verificationLabel: "Компания проверена модератором",
    updatedAt: "2026-08-30T13:45:00+05:00",
    responseMedianMinutes: 51,
    responseSampleSize: 6,
    portfolio: ["Outdoor team day", "Leadership lab", "Стратегическая сессия"],
    createdAt: "2026-08-19T16:30:00+05:00",
  },
  {
    id: "supplier-gulzor",
    slug: "gulzor-market",
    name: "Gulzor Market",
    city: "Ташкент",
    description: "Цветы, наборы декора и полиграфия для свадеб и семейных праздников.",
    verified: true,
    verificationLabel: "Магазин проверен модератором",
    updatedAt: "2026-09-01T12:20:00+05:00",
    responseMedianMinutes: 29,
    responseSampleSize: 15,
    portfolio: ["Свадебные букеты", "Декор для столов", "Именные приглашения"],
    createdAt: "2026-08-28T09:45:00+05:00",
  },
  {
    id: "supplier-ovoza-tech",
    slug: "ovoza-tech",
    name: "Ovoza Tech",
    city: "Ташкент",
    description: "Аренда, продажа и техническое сопровождение звука, света и экранов.",
    verified: true,
    verificationLabel: "Компания и оборудование проверены",
    updatedAt: "2026-09-01T15:10:00+05:00",
    responseMedianMinutes: 42,
    responseSampleSize: 9,
    portfolio: ["Свет для свадебной сцены", "LED-экран для конференции", "Звук для тимбилдинга"],
    createdAt: "2026-08-31T13:10:00+05:00",
  },
  {
    id: "supplier-orzu",
    slug: "orzu-ceremony",
    name: "Orzu Ceremony",
    city: "Ташкент",
    description: "Ведущие, DJ и живая музыка для свадеб и семейных мероприятий.",
    verified: true,
    verificationLabel: "Команда и портфолио проверены",
    updatedAt: "2026-09-02T09:00:00+05:00",
    responseMedianMinutes: 34,
    responseSampleSize: 11,
    portfolio: ["Свадебный вечер", "Выездная церемония", "Живая музыка"],
    createdAt: "2026-08-27T10:30:00+05:00",
  },
  {
    id: "supplier-safar",
    slug: "safar-wedding-cars",
    name: "Safar Wedding Cars",
    city: "Ташкент",
    description: "Автомобили с водителями и групповой трансфер гостей.",
    verified: true,
    verificationLabel: "Документы и автомобили проверены",
    updatedAt: "2026-09-02T09:00:00+05:00",
    responseMedianMinutes: 46,
    responseSampleSize: 7,
    portfolio: ["Автомобиль для пары", "Трансфер гостей", "Маршрут по городу"],
    createdAt: "2026-08-29T12:00:00+05:00",
  },
  {
    id: "supplier-shirin",
    slug: "shirin-atelier",
    name: "Shirin Atelier",
    city: "Ташкент",
    description: "Свадебные торты и порционные десерты для праздничного стола.",
    verified: true,
    verificationLabel: "Кондитерская проверена модератором",
    updatedAt: "2026-09-02T09:00:00+05:00",
    responseMedianMinutes: 27,
    responseSampleSize: 10,
    portfolio: ["Свадебный торт", "Сладкий стол", "Порционные десерты"],
    createdAt: "2026-08-30T11:10:00+05:00",
  },
  {
    id: "supplier-sahna",
    slug: "sahna-rental",
    name: "Sahna Rental",
    city: "Ташкент",
    description: "Аренда сцен, шатров, столов и стульев с доставкой и монтажом.",
    verified: true,
    verificationLabel: "Компания и оборудование проверены",
    updatedAt: "2026-09-02T09:00:00+05:00",
    responseMedianMinutes: 40,
    responseSampleSize: 8,
    portfolio: ["Сцена для концерта", "Шатёр для церемонии", "Мебель для банкета"],
    createdAt: "2026-08-30T16:20:00+05:00",
  },
];

export const services = catalogSeedServices;

export const seededConversations: Conversation[] = [
  {
    id: "conversation-silk-hall",
    clientAccount: "client@marosim.local",
    clientName: "Алина",
    supplierId: "supplier-silk-road",
    serviceId: "service-silk-hall",
    createdAt: "2026-09-01T18:20:00+05:00",
    updatedAt: "2026-09-01T18:42:00+05:00",
    firstSupplierResponseAt: "2026-09-01T18:42:00+05:00",
    messages: [
      {
        id: "message-silk-client",
        sender: "client",
        text: "Здравствуйте! Свободен ли зал 18 октября для свадьбы на 120 гостей?",
        createdAt: "2026-09-01T18:20:00+05:00",
        readAt: "2026-09-01T18:40:00+05:00",
      },
      {
        id: "message-silk-supplier",
        sender: "supplier",
        text: "Здравствуйте, Алина! Дата пока свободна. Расскажите, пожалуйста, нужен ли вам кейтеринг вместе с залом?",
        createdAt: "2026-09-01T18:42:00+05:00",
        readAt: null,
      },
    ],
  },
  {
    id: "conversation-silk-catering",
    clientAccount: "malika@example.com",
    clientName: "Малика",
    supplierId: "supplier-silk-road",
    serviceId: "service-silk-catering",
    createdAt: "2026-09-02T08:15:00+05:00",
    updatedAt: "2026-09-02T08:15:00+05:00",
    firstSupplierResponseAt: null,
    messages: [
      {
        id: "message-catering-client",
        sender: "client",
        text: "Добрый день! Что входит в стоимость кейтеринга на одного гостя?",
        createdAt: "2026-09-02T08:15:00+05:00",
        readAt: null,
      },
    ],
  },
];

export const seededModeration: ModerationItem[] = [
  {
    id: "moderation-sabo",
    serviceId: "service-sabo-garden",
    supplierId: "supplier-sabo-decor",
    reason: "Нужно подтвердить актуальность цены и доступность календаря.",
    status: "pending",
    updatedAt: "2026-09-01T10:00:00+05:00",
  },
];

export function getSupplierById(id: string) {
  return suppliers.find((supplier) => supplier.id === id);
}

export function getServiceById(id: string) {
  return services.find((service) => service.id === id);
}

export function getCategoryById(id: string) {
  return categories.find((category) => category.id === id);
}

import type {
  DemoRequest,
  DemoRole,
  ModerationItem,
  Service,
  ServiceCategory,
  Supplier,
} from "@/lib/types";

export const categories: ServiceCategory[] = [
  { id: "cat-venue", slug: "venue", name: "Площадка", icon: "⌂", requiredForWedding: true },
  { id: "cat-catering", slug: "catering", name: "Кейтеринг", icon: "◉", requiredForWedding: true },
  { id: "cat-photo", slug: "photo-video", name: "Фото и видео", icon: "▣", requiredForWedding: true },
  { id: "cat-decor", slug: "decor", name: "Декор и флористика", icon: "✦", requiredForWedding: true },
  { id: "cat-host", slug: "host", name: "Ведущий", icon: "◍", requiredForWedding: true },
  { id: "cat-music", slug: "music", name: "Музыка и DJ", icon: "♫", requiredForWedding: true },
  { id: "cat-transport", slug: "transport", name: "Транспорт", icon: "◇", requiredForWedding: false },
  { id: "cat-training", slug: "training", name: "Тренинги и тимбилдинг", icon: "△", requiredForWedding: false },
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
  },
];

export const services: Service[] = [
  {
    id: "service-silk-hall",
    supplierId: "supplier-silk-road",
    categoryId: "cat-venue",
    title: "Банкетный зал Silk Hall",
    description: "Зал до 180 гостей, базовая мебель, сцена и парковка.",
    city: "Ташкент",
    priceFrom: 18_000_000,
    priceUnit: "за день",
    active: true,
    published: true,
    updatedAt: "2026-08-31T09:30:00+05:00",
    availabilityConfirmedAt: "2026-08-31T09:30:00+05:00",
  },
  {
    id: "service-silk-catering",
    supplierId: "supplier-silk-road",
    categoryId: "cat-catering",
    title: "Свадебный кейтеринг",
    description: "Меню узбекской и европейской кухни, обслуживание и сервировка.",
    city: "Ташкент",
    priceFrom: 240_000,
    priceUnit: "за гостя",
    active: true,
    published: true,
    updatedAt: "2026-08-31T09:30:00+05:00",
    availabilityConfirmedAt: "2026-08-31T09:30:00+05:00",
  },
  {
    id: "service-nur-wedding",
    supplierId: "supplier-nur-photo",
    categoryId: "cat-photo",
    title: "Фото + видео полного свадебного дня",
    description: "Два оператора, фотограф, короткий ролик и полный фильм.",
    city: "Ташкент",
    priceFrom: 8_500_000,
    priceUnit: "за услугу",
    active: true,
    published: true,
    updatedAt: "2026-08-28T16:10:00+05:00",
    availabilityConfirmedAt: "2026-08-28T16:10:00+05:00",
  },
  {
    id: "service-sabo-garden",
    supplierId: "supplier-sabo-decor",
    categoryId: "cat-decor",
    title: "Оформление Garden Wedding",
    description: "Концепция, президиум, флористика и фотозона.",
    city: "Самарканд",
    priceFrom: 12_000_000,
    priceUnit: "за услугу",
    active: true,
    published: true,
    updatedAt: "2026-06-12T11:00:00+05:00",
    availabilityConfirmedAt: null,
  },
  {
    id: "service-teamcraft-day",
    supplierId: "supplier-teamcraft",
    categoryId: "cat-training",
    title: "Командный день под ключ",
    description: "Диагностика запроса, сценарий, два фасилитатора и разбор результатов.",
    city: "Ташкент",
    priceFrom: 14_000_000,
    priceUnit: "за услугу",
    active: true,
    published: true,
    updatedAt: "2026-08-30T13:45:00+05:00",
    availabilityConfirmedAt: "2026-08-30T13:45:00+05:00",
  },
];

export const seededRequests: DemoRequest[] = [
  {
    id: "request-demo-1",
    clientName: "Алина",
    clientPhone: "+998 90 123 45 67",
    supplierId: "supplier-silk-road",
    serviceId: "service-silk-hall",
    eventType: "Свадьба",
    eventDate: "2026-10-18",
    city: "Ташкент",
    guestCount: 120,
    budget: 25_000_000,
    message: "Нужен зал и информация по свободным датам, меню обсудим отдельно.",
    status: "submitted",
    createdAt: "2026-09-01T18:20:00+05:00",
    firstViewedAt: null,
    firstRespondedAt: null,
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

export const demoAccounts: Array<{
  email: string;
  password: string;
  name: string;
  role: DemoRole;
  description: string;
}> = [
  { email: "client@marosim.local", password: "Marosim-Local-2026!", name: "Клиент", role: "client", description: "Ищет услуги и отправляет заявки" },
  { email: "planner@marosim.local", password: "Marosim-Local-2026!", name: "Организатор", role: "client_planner", description: "Собирает план события и бюджет" },
  { email: "supplier@marosim.local", password: "Marosim-Local-2026!", name: "Поставщик", role: "supplier", description: "Управляет услугами и заявками" },
  { email: "supplier-planner@marosim.local", password: "Marosim-Local-2026!", name: "Координатор поставщика", role: "supplier_planner", description: "Следит за загрузкой и ответами" },
  { email: "admin@marosim.local", password: "Marosim-Local-2026!", name: "Администратор", role: "admin", description: "Модерирует каталог и блокировки" },
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

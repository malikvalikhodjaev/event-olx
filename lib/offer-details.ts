import { catalogSeedServices } from "@/lib/catalog-seed";
import { serviceDescription, serviceTitle } from "@/lib/i18n";
import type { LocalizedCopy, OfferDetails, OfferFact, OfferPackage, Service } from "@/lib/types";

const copy = (ru: string, uz: string): LocalizedCopy => ({ ru, uz });

const EVENT = {
  wedding: copy("Свадьба", "To‘y"),
  nikah: copy("Никах / религиозный обряд", "Nikoh / diniy marosim"),
  birthday: copy("Юбилей / день рождения", "Yubiley / tug‘ilgan kun"),
  children: copy("Детский праздник", "Bolalar bayrami"),
  corporate: copy("Корпоратив / конференция", "Korporativ / konferensiya"),
  teamBuilding: copy("Тимбилдинг", "Timbilding"),
  horeca: copy("Событие HoReCa", "HoReCa tadbiri"),
  family: copy("Другое семейное торжество", "Boshqa oilaviy bayram"),
  proposal: copy("Предложение руки и сердца", "Nikoh taklifi"),
};

export const eventTypeOptions = [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.children, EVENT.corporate, EVENT.teamBuilding, EVENT.horeca, EVENT.family];

const eventTypesByCategory: Record<string, LocalizedCopy[]> = {
  "cat-venue": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.corporate, EVENT.horeca, EVENT.family],
  "cat-catering": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.corporate, EVENT.horeca, EVENT.family],
  "cat-photo": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.corporate, EVENT.family],
  "cat-decor": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.children, EVENT.corporate, EVENT.horeca, EVENT.family],
  "cat-host": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.children, EVENT.corporate, EVENT.horeca, EVENT.family],
  "cat-music": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.corporate, EVENT.horeca, EVENT.family],
  "cat-transport": [EVENT.wedding, EVENT.corporate, EVENT.family],
  "cat-training": [EVENT.corporate, EVENT.teamBuilding],
  "cat-planning": [EVENT.wedding, EVENT.corporate, EVENT.teamBuilding, EVENT.horeca, EVENT.family],
  "cat-flowers": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.family],
  "cat-event-details": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.children, EVENT.family],
  "cat-gifts-print": [EVENT.wedding, EVENT.birthday, EVENT.corporate, EVENT.family],
  "cat-cakes": [EVENT.wedding, EVENT.nikah, EVENT.birthday, EVENT.children, EVENT.family],
  "cat-tableware": [EVENT.wedding, EVENT.birthday, EVENT.corporate, EVENT.horeca, EVENT.family],
  "cat-sound-light": [EVENT.wedding, EVENT.birthday, EVENT.corporate, EVENT.teamBuilding, EVENT.horeca],
  "cat-screens-stage": [EVENT.wedding, EVENT.corporate, EVENT.teamBuilding, EVENT.horeca],
  "cat-event-rental": [EVENT.wedding, EVENT.birthday, EVENT.corporate, EVENT.teamBuilding, EVENT.horeca, EVENT.family],
  "cat-power-effects": [EVENT.wedding, EVENT.birthday, EVENT.corporate, EVENT.teamBuilding, EVENT.horeca],
  "cat-marry-me": [EVENT.proposal, EVENT.wedding, EVENT.family],
};

const categoryFacts: Record<string, OfferFact[]> = {
  "cat-venue": [
    { label: copy("Вместимость", "Sig‘imi"), value: copy("до 120 гостей", "120 mehmon gacha") },
    { label: copy("Формат", "Format"), value: copy("банкет и церемония", "banket va marosim") },
    { label: copy("Парковка", "Avtoturargoh"), value: copy("есть", "mavjud") },
  ],
  "cat-catering": [
    { label: copy("Минимальный заказ", "Minimal buyurtma"), value: copy("от 30 гостей", "30 mehmondan") },
    { label: copy("Подача", "Taqdim etish"), value: copy("банкет или фуршет", "banket yoki furshet") },
    { label: copy("Персонал", "Xodimlar"), value: copy("официанты включены", "ofitsiantlar kiritilgan") },
  ],
  "cat-photo": [
    { label: copy("Готовность", "Tayyor bo‘lishi"), value: copy("до 20 рабочих дней", "20 ish kunigacha") },
    { label: copy("Результат", "Natija"), value: copy("онлайн-галерея", "onlayn galereya") },
    { label: copy("Выезд", "Safar"), value: copy("по Узбекистану", "O‘zbekiston bo‘ylab") },
  ],
  "cat-host": [
    { label: copy("Длительность", "Davomiyligi"), value: copy("до 6 часов", "6 soatgacha") },
    { label: copy("Состав", "Tarkib"), value: copy("ведущий; DJ — по пакету", "boshlovchi; DJ — paket bo‘yicha") },
    { label: copy("Подготовка", "Tayyorgarlik"), value: copy("созвон и сценарный план", "qo‘ng‘iroq va ssenariy rejasi") },
  ],
  "cat-marry-me": [
    { label: copy("Формат", "Format"), value: copy("индивидуальный сценарий", "individual ssenariy") },
    { label: copy("Подготовка", "Tayyorgarlik"), value: copy("от 3 дней", "3 kundan") },
    { label: copy("Команда", "Jamoa"), value: copy("координатор и фотограф", "koordinator va fotograf") },
  ],
};

const defaultFacts: OfferFact[] = [
  { label: copy("Формат", "Format"), value: copy("по предварительному согласованию", "oldindan kelishilgan holda") },
  { label: copy("Заказ", "Buyurtma"), value: copy("детали уточняются в чате", "tafsilotlar suhbatda aniqlanadi") },
  { label: copy("Оплата", "To‘lov"), value: copy("условия согласуются с автором", "shartlar muallif bilan kelishiladi") },
];

function genericPackages(service: Service): OfferPackage[] {
  return [
    {
      name: copy("Основной", "Asosiy"),
      summary: copy("Базовый состав предложения без дополнительных опций.", "Qo‘shimcha variantlarsiz asosiy taklif tarkibi."),
      priceFrom: service.priceFrom,
      includes: [
        copy("Предварительное согласование деталей", "Tafsilotlarni oldindan kelishish"),
        copy("Основной объём из описания", "Tavsifdagi asosiy hajm"),
        copy("Подтверждение даты или наличия в чате", "Sana yoki mavjudlikni suhbatda tasdiqlash"),
      ],
    },
    {
      name: copy("Расширенный", "Kengaytirilgan"),
      summary: copy("Больше времени или объёма и одна дополнительная опция.", "Ko‘proq vaqt yoki hajm va bitta qo‘shimcha variant."),
      priceFrom: Math.round(service.priceFrom * 1.6 / 10_000) * 10_000,
      highlighted: true,
      includes: [
        copy("Всё из основного пакета", "Asosiy paketdagi barcha xizmatlar"),
        copy("Дополнительное время или объём", "Qo‘shimcha vaqt yoki hajm"),
        copy("Одна дополнительная опция на выбор", "Tanlov bo‘yicha bitta qo‘shimcha variant"),
      ],
    },
  ];
}

function hostPackages(service: Service): OfferPackage[] {
  return [
    {
      name: copy("Ведение вечера", "Kechani olib borish"),
      summary: copy("Для пары, которой нужен ведущий и заранее согласованная программа.", "Boshlovchi va oldindan kelishilgan dastur kerak bo‘lgan juftlik uchun."),
      priceFrom: service.priceFrom,
      includes: [
        copy("Знакомство и интервью с парой", "Juftlik bilan tanishuv va suhbat"),
        copy("Сценарный план до дня события", "Tadbir kunigacha ssenariy rejasi"),
        copy("Ведение до 6 часов", "6 soatgacha olib borish"),
        copy("Согласованный список интерактивов", "Kelishilgan interaktivlar ro‘yxati"),
      ],
    },
    {
      name: copy("Ведущий + DJ", "Boshlovchi + DJ"),
      summary: copy("Один согласованный сценарий, музыка и базовый звуковой комплект.", "Yagona kelishilgan ssenariy, musiqa va asosiy ovoz to‘plami."),
      priceFrom: 10_000_000,
      highlighted: true,
      includes: [
        copy("Всё из пакета «Ведение вечера»", "«Kechani olib borish» paketidagi barcha xizmatlar"),
        copy("DJ и музыкальный план", "DJ va musiqa rejasi"),
        copy("Два радиомикрофона", "Ikki radio mikrofon"),
        copy("Базовый звук для банкетного зала", "Banket zali uchun asosiy ovoz uskunasi"),
      ],
    },
  ];
}

function fullDescription(service: Service): LocalizedCopy {
  if (service.id === "service-orzu-host") {
    return copy(
      "Азиз проводит свадебные вечера на русском и узбекском языках. До события он знакомится с парой, уточняет состав гостей, важные семейные традиции, музыкальные пожелания и темы, которых стоит избегать. Затем команда готовит короткий сценарный план и согласует его с вами. В программу входят приветствие гостей, объявления, тосты и аккуратные интерактивы без давления на участников. Точная длительность, дата, площадка и технический комплект подтверждаются в чате.",
      "Aziz to‘y kechalarini rus va o‘zbek tillarida olib boradi. Tadbirdan oldin u juftlik bilan tanishadi, mehmonlar tarkibi, muhim oilaviy an’analar, musiqa istaklari va chetlab o‘tiladigan mavzularni aniqlaydi. Keyin jamoa qisqa ssenariy rejasini tayyorlab, siz bilan kelishadi. Dastur mehmonlarni kutib olish, e’lonlar, tabriklar va ishtirokchilarga bosimsiz interaktivlarni o‘z ichiga oladi. Aniq davomiylik, sana, joy va texnik to‘plam suhbatda tasdiqlanadi.",
    );
  }

  if (service.id === "service-nur-love-story") {
    return copy(
      "Команда помогает подготовить личное предложение руки и сердца: уточняет историю пары, предлагает подходящую локацию и собирает спокойный сценарий без лишней публики. В день события координатор следит за временем, фотограф снимает сам момент и короткую прогулку после него. Декор, музыка и дополнительные гости добавляются по желанию. Финальный состав и запасной план на плохую погоду подтверждаются в чате.",
      "Jamoa shaxsiy nikoh taklifini tayyorlashga yordam beradi: juftlik tarixini bilib oladi, mos joyni taklif qiladi va ortiqcha tomoshabinlarsiz sokin ssenariy tuzadi. Tadbir kuni koordinator vaqtni nazorat qiladi, fotograf esa taklif lahzasi va undan keyingi qisqa sayrni suratga oladi. Bezash, musiqa va qo‘shimcha mehmonlar istakka ko‘ra qo‘shiladi. Yakuniy tarkib va yomon ob-havo uchun zaxira reja suhbatda tasdiqlanadi.",
    );
  }

  return copy(
    `${service.description} Перед заказом автор уточнит дату, место, нужный объём и дополнительные пожелания. Итоговый состав и цена фиксируются в переписке после уточнения деталей.`,
    `${serviceDescription("uz", service)} Buyurtmadan oldin muallif sana, joy, kerakli hajm va qo‘shimcha istaklarni aniqlaydi. Yakuniy tarkib va narx tafsilotlar aniqlangach suhbatda qayd etiladi.`,
  );
}

export function getOfferDetails(service: Service): OfferDetails {
  const relatedMedia = catalogSeedServices
    .filter((item) => item.supplierId === service.supplierId)
    .filter((item, index, items) => items.findIndex((candidate) => candidate.imageUrl === item.imageUrl) === index)
    .slice(0, 5)
    .map((item, index) => ({
      id: `${service.id}-media-${index + 1}`,
      type: "image" as const,
      title: copy(item.title, serviceTitle("uz", item)),
      url: item.imageUrl,
    }));

  const media = relatedMedia.some((item) => item.url === service.imageUrl)
    ? relatedMedia
    : [{ id: `${service.id}-media-cover`, type: "image" as const, title: copy(service.title, serviceTitle("uz", service)), url: service.imageUrl }, ...relatedMedia].slice(0, 5);

  return {
    fullDescription: fullDescription(service),
    eventTypes: eventTypesByCategory[service.categoryId] ?? [EVENT.wedding, EVENT.family],
    serviceArea: copy(`${service.city} и ближайшие районы`, `${service.city} va yaqin hududlar`),
    travelTerms: copy("Выезд за пределы города рассчитывается отдельно", "Shahar tashqarisiga chiqish alohida hisoblanadi"),
    availabilityNote: copy("Свободную дату или наличие автор подтверждает в чате", "Bo‘sh sana yoki mavjudlikni muallif suhbatda tasdiqlaydi"),
    packages: service.id === "service-orzu-host" ? hostPackages(service) : genericPackages(service),
    media,
    facts: categoryFacts[service.categoryId] ?? defaultFacts,
    person: service.id === "service-orzu-host" ? {
      name: "Азиз Рахимов",
      role: copy("Ведущий", "Boshlovchi"),
      photoUrl: service.imageUrl,
      gender: copy("Мужчина", "Erkak"),
      age: 32,
      experienceYears: 8,
      languages: copy("Русский, узбекский", "Rus, o‘zbek"),
    } : undefined,
  };
}

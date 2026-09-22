import { expect, test } from "@playwright/test";
import ExcelJS from "exceljs";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
  await page.reload();
});

test("главная ведёт клиента к поиску и входу", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Найдите всё для своего мероприятия" })).toBeVisible();
  await page.getByLabel("Что нужно для события?").fill("фото");
  await page.getByRole("button", { name: "Найти", exact: true }).click();
  await expect(page.getByRole("button", { name: "Продолжить с Google" })).toBeVisible();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page.getByRole("radio", { name: /Я хочу найти для события/ })).toBeChecked();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/catalog\?q=/);
  await expect(page.getByRole("searchbox", { name: "Что ищете" })).toHaveValue("фото");
});

test("русский и узбекский используют один каталог", async ({ page }) => {
  await page.getByRole("button", { name: "O‘Z", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  await page.getByRole("link", { name: "Katalog", exact: true }).click();
  await expect(page.getByText("Topildi: 100")).toBeVisible();
  await page.getByLabel("Nima izlayapsiz").fill("boshlovchi");
  await expect(page.getByTestId("service-card")).not.toHaveCount(0);
  await page.getByRole("button", { name: "RU", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
});

test("мобильный старт и кабинет автора остаются доступны", async ({ page }) => {
  await page.goto("/mobile_app");
  await expect(page.getByRole("heading", { name: "Что нужно для события?" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Открыть раздел автора" })).toBeVisible();
  await page.goto("/mobile_app/supplier");
  await expect(page.getByRole("heading", { name: "Получайте обращения и управляйте предложениями" })).toBeVisible();
  await page.getByRole("link", { name: "Войти как автор предложения" }).click();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/mobile_app\/supplier$/);
  await expect(page.getByRole("link", { name: /Загрузить прайс/ })).toBeVisible();
});

test("каталог содержит 100 исходных предложений и фильтруется", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByText("Найдено: 100")).toBeVisible();
  await expect(page.getByTestId("service-card")).toHaveCount(100);
  await expect(page.getByRole("article").filter({ hasText: "Банкетный зал Seoul" })).toBeVisible();
  await page.getByRole("button", { name: /^Маркет/ }).click();
  await page.getByLabel("Как получить").selectOption("sale");
  await expect(page.getByRole("link", { name: "Букет для невесты", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Банкетный зал Seoul — свадьбы и мероприятия", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: /^Техника/ }).click();
  await expect(page.getByRole("link", { name: "Букет для невесты", exact: true })).toHaveCount(0);
});

test("анонимное сохранение сначала просит войти", async ({ page }) => {
  await page.goto("/offers/offer-seoul-hall");
  await page.getByRole("button", { name: /Сохранить/ }).click();
  await expect(page).toHaveURL(/\/login\?/);
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/offers\/offer-seoul-hall$/);
  await expect(page.getByRole("button", { name: /Сохранено/ })).toHaveAttribute("aria-pressed", "true");
  await page.goto("/saved");
  await expect(page.getByRole("heading", { name: /Банкетный зал Seoul/ })).toBeVisible();
});

test("страница предложения показывает источник без выдуманных фактов", async ({ page }) => {
  await page.goto("/offers/offer-seoul-hall");
  await expect(page.getByRole("heading", { name: "Банкетный зал Seoul — свадьбы и мероприятия" })).toBeVisible();
  await expect(page.getByText("Цена по запросу").first()).toBeVisible();
  await expect(page.getByText("Профиль пока не подтверждён в Marosim.")).toBeVisible();
  await expect(page.getByRole("link", { name: /Связаться с автором/ })).toHaveAttribute("href", "https://seoulhall.uz/");
  await expect(page.getByRole("link", { name: /Это ваша страница/ })).toHaveAttribute("href", "https://t.me/malik_valikhodjaev");
  await expect(page.getByRole("heading", { name: "Пакеты и состав" })).toHaveCount(0);
  await expect(page.getByText("Скорость ответа")).toHaveCount(0);
  await page.getByRole("button", { name: /Увеличить: Банкетный зал Seoul/ }).click();
  await expect(page.getByRole("dialog", { name: "Увеличенная фотография" })).toBeVisible();
});

test("расчёт по внешнему объявлению готовит текст, не изображая доставку", async ({ page }) => {
  await page.goto("/offers/offer-seoul-hall");
  await page.getByRole("button", { name: "Рассчитать", exact: true }).click();
  await page.getByLabel("Дата события").fill("2026-11-07");
  await page.getByLabel("Количество людей").fill("80");
  await page.getByRole("button", { name: "Подготовить запрос" }).click();
  await expect(page.getByRole("textbox", { name: "Текст запроса" })).toContainText("Людей: 80");
  await expect(page.getByRole("link", { name: /Открыть объявление и отправить/ })).toHaveAttribute("href", "https://seoulhall.uz/");
  await expect(page).toHaveURL(/\/offers\/offer-seoul-hall$/);
});

test("поиск понимает мери ми, а страница автора помечена как неподтверждённая", async ({ page }) => {
  await page.goto("/catalog");
  await page.getByRole("searchbox", { name: "Что ищете" }).fill("мери ми");
  await expect(page.getByTestId("service-card")).toHaveCount(4);
  await page.goto("/suppliers/site-seoulhall-uz");
  await expect(page.getByRole("heading", { name: "Банкетный зал Seoul", exact: true })).toBeVisible();
  await expect(page.getByText("Профиль не подтверждён в Marosim")).toBeVisible();
  await expect(page.getByRole("link", { name: /Это ваша страница/ })).toHaveAttribute("href", "https://t.me/malik_valikhodjaev");
  await expect(page.getByRole("link", { name: /Сайт/ })).toHaveAttribute("href", "https://seoulhall.uz/");
});

test("админ видит честный счётчик SKU и внешних авторов", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Раздел только для сотрудников" })).toBeVisible();
  await page.goto("/login?role=admin&next=/admin");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("article").filter({ hasText: "SKU в каталоге" }).locator("strong")).toHaveText("100");
  await expect(page.getByRole("article").filter({ hasText: "Авторы в каталоге" }).locator("strong")).toHaveText("87");
  await expect(page.getByText("87 профилей не подтверждены")).toBeVisible();
  await expect(page.getByText(/Посетители и диалоги учитываются только в этом браузере/)).toBeVisible();
});

test("автор загружает Excel и видит личный черновик", async ({ page }) => {
  const templateResponse = await page.request.get("/api/templates/services");
  expect(templateResponse.ok()).toBe(true);
  const templateWorkbook = new ExcelJS.Workbook();
  const templateBytes = Uint8Array.from(await templateResponse.body());
  await templateWorkbook.xlsx.load(Buffer.from(templateBytes) as unknown as Parameters<typeof templateWorkbook.xlsx.load>[0]);
  expect(templateWorkbook.getWorksheet("Предложения")?.getCell("E1").value).toBe("offer_kind");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Предложения");
  sheet.addRow(["external_id", "title_ru", "title_uz", "category", "offer_kind", "city", "description_ru", "description_uz", "price_from", "price_unit", "availability"]);
  sheet.addRow(["TEST-001", "Новый банкетный пакет", "Yangi banket paketi", "catering", "service", "Ташкент", "Меню, обслуживание и базовая сервировка для гостей.", "Mehmonlar uchun menyu, xizmat va asosiy dasturxon bezagi.", 300000, "за гостя", "доступно"]);
  const buffer = await workbook.xlsx.writeBuffer();
  await page.goto("/supplier/import");
  await page.locator("#price-file").setInputFiles({ name: "services.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer: Buffer.from(buffer) });
  await expect(page.getByText("Готово: 1")).toBeVisible();
  await page.getByRole("button", { name: "Добавить предложения: 1" }).click();
  await page.goto("/supplier");
  await expect(page.getByText("Новый банкетный пакет")).toBeVisible();
  const previewHref = await page.getByRole("link", { name: "Предпросмотр" }).getAttribute("href");
  expect(previewHref).toMatch(/^\/offers\/preview\?id=import-/);
  await page.goto(previewHref!);
  await expect(page.getByRole("heading", { name: "Новый банкетный пакет" })).toBeVisible();
});

import { expect, test } from "@playwright/test";
import ExcelJS from "exceljs";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("пользователь входит и выбирает задачу", async ({ page }) => {
  await page.getByRole("link", { name: "Войти", exact: true }).first().click();
  await page.getByLabel("Телефон или электронная почта").fill("malika@example.com");
  await page.getByLabel("Пароль").fill("marosim2026");
  await page.getByRole("radio", { name: /Организую событие/ }).check();
  await page.getByRole("button", { name: "Войти", exact: true }).click();
  await expect(page).toHaveURL(/\/planner$/);
  await expect(page.getByRole("link", { name: "Кабинет", exact: true }).first()).toBeVisible();
});

test("клиент фильтрует каталог и добавляет услугу в shortlist", async ({ page }) => {
  await page.goto("/catalog");
  await page.getByRole("searchbox", { name: "Что ищете" }).fill("фото");
  const photoCard = page.getByRole("article").filter({ hasText: "Фото + видео полного свадебного дня" });
  await expect(photoCard).toBeVisible();
  await photoCard.getByRole("button", { name: "В подборку" }).click();
  await expect(photoCard.getByRole("button", { name: "Убрать из подборки" })).toHaveAttribute("aria-pressed", "true");
});

test("клиент открывает Маркет и видит товары отдельно от услуг", async ({ page }) => {
  await page.goto("/catalog");
  await page.getByRole("button", { name: /^Маркет/ }).click();
  await page.getByLabel("Как получить").selectOption("sale");
  await expect(page.getByText("Свадебный букет из сезонных цветов")).toBeVisible();
  await expect(page.getByText("Фото + видео полного свадебного дня")).toBeHidden();

  await page.getByRole("button", { name: /^Техника/ }).click();
  await expect(page.getByText("Гирлянда тёплого света, 20 метров")).toBeVisible();
  await expect(page.getByText("Свадебный букет из сезонных цветов")).toBeHidden();
});

test("планировщик закрывает категорию и видит прогресс", async ({ page }) => {
  await page.goto("/planner");
  await page.locator("#service-cat-venue").selectOption("service-silk-hall");
  await expect(page.getByLabel(/Готовность/)).toHaveAttribute("aria-label", /17%/);
});

test("клиент отправляет заявку, поставщик отвечает", async ({ page }) => {
  await page.goto("/requests/new?service=service-silk-hall");
  await page.locator("#clientName").fill("Малика");
  await page.locator("#clientPhone").fill("+998 90 555 44 33");
  await page.locator("#eventDate").fill("2026-11-20");
  await page.locator("#message").fill("Нужен зал на вечер, сообщите свободное время и состав пакета.");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByText(/Заявка отправлена поставщику/)).toBeVisible();
  await page.goto("/supplier");
  await page.getByRole("button", { name: "Принять к обсуждению" }).first().click();
  await expect(page.getByText("Принята к обсуждению").first()).toBeVisible();
});

test("администратор фиксирует модерацию и блокировку в аудите", async ({ page }) => {
  await page.goto("/admin");
  await page.locator("#reason-moderation-sabo").fill("Цена подтверждена поставщиком 1 сентября");
  await page.getByRole("button", { name: "Одобрить" }).click();
  await expect(page.getByText("Карточка одобрена")).toBeVisible();
  await page.locator("#ban-supplier-sabo-decor").fill("Проверка жалобы клиента");
  await page.getByRole("button", { name: "Заблокировать" }).nth(2).click();
  await expect(page.getByText("Поставщик заблокирован")).toBeVisible();
});

test("поставщик загружает Excel и создает непубличный черновик", async ({ page }) => {
  const templateResponse = await page.request.get("/api/templates/services");
  expect(templateResponse.ok()).toBe(true);
  const templateWorkbook = new ExcelJS.Workbook();
  const templateBytes = Uint8Array.from(await templateResponse.body());
  await templateWorkbook.xlsx.load(Buffer.from(templateBytes));
  const templateSheet = templateWorkbook.getWorksheet("Предложения");
  expect(templateSheet?.getCell("D1").value).toBe("offer_kind");
  expect(templateSheet?.getCell("D3").value).toBe("sale");
  expect(templateWorkbook.getWorksheet("Справочники")?.getColumn(1).values).toContain("flowers");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Предложения");
  sheet.addRow(["external_id", "title", "category", "offer_kind", "city", "description", "price_from", "price_unit", "availability"]);
  sheet.addRow(["TEST-001", "Новый банкетный пакет", "catering", "service", "Ташкент", "Меню, обслуживание и базовая сервировка для гостей.", 300000, "за гостя", "доступно"]);
  const buffer = await workbook.xlsx.writeBuffer();
  await page.goto("/supplier/import");
  await page.locator("#price-file").setInputFiles({ name: "services.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", buffer: Buffer.from(buffer) });
  await expect(page.getByText("Готово: 1")).toBeVisible();
  const createDrafts = page.getByRole("button", { name: "Добавить предложения: 1" });
  await createDrafts.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await createDrafts.click();
  await page.goto("/supplier");
  await expect(page.getByText("Новый банкетный пакет")).toBeVisible();
  await expect(page.getByText("Черновик", { exact: true }).last()).toBeVisible();
});

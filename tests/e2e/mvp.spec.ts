import { expect, test } from "@playwright/test";
import ExcelJS from "exceljs";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("пользователь входит и выбирает задачу", async ({ page }) => {
  await page.getByRole("link", { name: "Войти в Маросим", exact: true }).click();
  await expect(page.getByRole("radio", { name: /Управляю платформой/ })).toHaveCount(0);
  await page.getByRole("radio", { name: /Я организую событие/ }).check();
  await page.getByLabel("Номер телефона").fill("+998 90 555 44 33");
  await page.getByRole("button", { name: "Получить код" }).click();
  await page.getByLabel("Код из SMS").fill("1234");
  await page.getByRole("button", { name: "Подтвердить и продолжить" }).click();
  await expect(page).toHaveURL(/\/planner$/);
  await expect(page.getByRole("link", { name: "Кабинет", exact: true }).first()).toBeVisible();
});

test("главная показывает один явный первый шаг", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Найди всё для своего мероприятия" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Найти", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Администратор" })).toHaveCount(0);
  await page.getByRole("link", { name: "Найти", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?role=client&next=(%2F|\/)catalog/);
  await expect(page.getByRole("button", { name: "Продолжить с Google" })).toBeVisible();
});

test("админ-панель не открывается без внутреннего входа", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Раздел только для сотрудников" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Состояние платформы" })).toHaveCount(0);
});

test("клиент фильтрует каталог и добавляет услугу в shortlist", async ({ page }) => {
  await page.goto("/catalog");
  await page.getByRole("searchbox", { name: "Что ищете" }).fill("фото");
  const photoCard = page.getByRole("article").filter({ hasText: "Фото + видео полного свадебного дня" });
  await expect(photoCard).toBeVisible();
  await expect(photoCard.locator("img")).toBeVisible();
  await expect(photoCard.getByText("Поставщик проверен")).toBeVisible();
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

test("клиент пишет поставщику и получает ответ в чате", async ({ page }) => {
  const clientMessage = "Здравствуйте! Свободен ли зал 20 ноября и что входит в стоимость?";
  const supplierMessage = "Здравствуйте! Дата свободна, сейчас пришлю полный состав предложения.";

  await page.goto("/login");
  await page.getByRole("radio", { name: /Я хочу найти для события/ }).check();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.goto("/catalog");
  const hallCard = page.getByRole("article").filter({ hasText: "Банкетный зал Silk Hall" });
  await hallCard.getByRole("link", { name: "Написать поставщику" }).click();
  await expect(page).toHaveURL(/\/chats\?service=service-silk-hall/);
  await page.getByLabel("Сообщение").fill(clientMessage);
  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.locator(".chat-message p").filter({ hasText: clientMessage })).toBeVisible();

  await page.goto("/login");
  await page.getByRole("radio", { name: /Я предоставляю услуги или продаю товары/ }).check();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/supplier$/);
  await page.goto("/chats");
  await page.locator(".chat-list-item").filter({ hasText: clientMessage }).click();
  await page.getByLabel("Сообщение").fill(supplierMessage);
  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.locator(".chat-message p").filter({ hasText: supplierMessage })).toBeVisible();

  await page.goto("/login?next=/chats");
  await page.getByRole("radio", { name: /Я хочу найти для события/ }).check();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/chats$/);
  await expect(page.locator(".chat-message p").filter({ hasText: supplierMessage })).toBeVisible();
});

test("администратор фиксирует модерацию и блокировку в аудите", async ({ page }) => {
  await page.goto("/login?role=admin&next=/admin");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.locator("#reason-moderation-sabo").fill("Цена подтверждена поставщиком 1 сентября");
  await page.getByRole("button", { name: "Одобрить" }).click();
  await expect(page.getByText("Карточка одобрена")).toBeVisible();
  await page.locator("#ban-supplier-sabo-decor").fill("Проверка жалобы клиента");
  await page.getByRole("button", { name: "Заблокировать" }).nth(2).click();
  await expect(page.getByText("Поставщик заблокирован")).toBeVisible();
});

test("администратор видит сводку и меняет период", async ({ page }) => {
  await page.goto("/login?role=admin&next=/admin");
  await page.getByRole("radio", { name: /Управляю платформой/ }).check();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Состояние платформы" })).toBeVisible();
  await expect(page.getByRole("article").filter({ hasText: "Активные пользователи" }).locator("strong")).toHaveText("1");
  await expect(page.getByRole("article").filter({ hasText: "Сейчас онлайн" }).locator("strong")).toHaveText("1");
  await page.getByRole("button", { name: "7 дней" }).click();
  await expect(page.getByText("Последние 7 дней.")).toBeVisible();
});

test("поставщик загружает Excel и создает непубличный черновик", async ({ page }) => {
  const templateResponse = await page.request.get("/api/templates/services");
  expect(templateResponse.ok()).toBe(true);
  const templateWorkbook = new ExcelJS.Workbook();
  const templateBytes = Uint8Array.from(await templateResponse.body());
  const templateBuffer = Buffer.from(templateBytes) as unknown as Parameters<typeof templateWorkbook.xlsx.load>[0];
  await templateWorkbook.xlsx.load(templateBuffer);
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

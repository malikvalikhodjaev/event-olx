import { expect, test } from "@playwright/test";
import ExcelJS from "exceljs";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("пользователь сначала входит, затем выбирает профиль", async ({ page }) => {
  await page.getByRole("link", { name: "Войти в Маросим", exact: true }).click();
  await expect(page.getByRole("radio")).toHaveCount(0);
  await page.getByLabel("Номер телефона").fill("+998 90 555 44 33");
  await page.getByRole("button", { name: "Получить код" }).click();
  await page.getByLabel("Код из SMS").fill("1234");
  await page.getByRole("button", { name: "Подтвердить и продолжить" }).click();
  await expect(page).toHaveURL(/\/onboarding\?/);
  await expect(page.getByRole("radio")).toHaveCount(2);
  await expect(page.getByRole("radio", { name: /Я хочу найти для события/ })).toBeChecked();
  await expect(page.getByRole("radio", { name: /Я предлагаю услуги или товары/ })).toBeVisible();
  await expect(page.getByText("Я организую событие")).toHaveCount(0);
  await expect(page.getByText("Я планирую работу команды")).toHaveCount(0);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/catalog$/);
  await expect(page.getByRole("link", { name: "Кабинет", exact: true }).first()).toBeVisible();
});

test("главная показывает один явный первый шаг", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Найдите всё для своего мероприятия" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Найти", exact: true })).toBeVisible();
  await expect(page.getByLabel("Предлагаете услуги или товары?").getByRole("link", { name: "Разместить предложение", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Поддержка: +998 90 000-00-00" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Администратор" })).toHaveCount(0);
  await page.getByLabel("Что нужно для события?").fill("фото");
  await page.getByRole("button", { name: "Найти", exact: true }).click();
  await expect.poll(() => decodeURIComponent(new URL(page.url()).searchParams.get("next") ?? "")).toBe("/catalog?q=фото");
  await expect(page.getByRole("button", { name: "Продолжить с Google" })).toBeVisible();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/onboarding\?/);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe("фото");
  await expect(page.getByRole("searchbox", { name: "Что ищете" })).toHaveValue("фото");
});

test("условия использования доступны из публичного сайта", async ({ page }) => {
  await page.goto("/offer");
  await expect(page.getByRole("heading", { name: "Условия использования и публичная оферта" })).toBeVisible();
  await expect(page.getByText("Платные функции Marosim пока не подключены.")).toBeVisible();
  await expect(page.getByRole("link", { name: "+998 90 000-00-00", exact: true })).toBeVisible();
});

test("пользователь переключает сайт на узбекский и возвращает русский", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "O‘Z", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  await expect(page.getByRole("heading", { name: "Tadbiringiz uchun hamma narsani toping" })).toBeVisible();
  await expect(page.getByLabel("Xizmat yoki mahsulot taklif qilasizmi?").getByRole("link", { name: "E’lon joylashtirish", exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Katalog", exact: true }).click();
  await expect(page.getByText("Topildi: 100")).toBeVisible();
  await page.getByLabel("Nima izlayapsiz").fill("boshlovchi");
  await expect(page.locator('[data-testid="service-card"]')).not.toHaveCount(0);

  await page.getByRole("button", { name: "RU", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "ru");
  await expect(page.getByLabel("Что ищете")).toHaveValue("boshlovchi");
});

test("мобильная главная начинает сценарий с поиска", async ({ page }) => {
  await page.goto("/mobile_app");
  await expect(page.getByRole("heading", { name: "Что нужно для события?" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Открыть раздел автора" })).toBeVisible();
  await page.getByRole("searchbox", { name: "Что нужно для события?" }).fill("ведущий");
  await page.getByRole("button", { name: "Найти", exact: true }).click();
  await expect.poll(() => decodeURIComponent(new URL(page.url()).searchParams.get("next") ?? "")).toBe("/catalog?q=ведущий");
});

test("автор предложения входит в отдельный мобильный рабочий раздел", async ({ page }) => {
  await page.goto("/mobile_app/supplier");
  await expect(page.getByRole("heading", { name: "Получайте обращения и управляйте предложениями" })).toBeVisible();
  await page.getByRole("link", { name: "Войти как автор предложения" }).click();
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page.getByRole("radio", { name: /Я предлагаю услуги или товары/ })).toBeChecked();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/mobile_app\/supplier$/);
  await expect(page.getByRole("heading", { name: "Добрый день!" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Быстрые действия" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Загрузить прайс/ })).toBeVisible();
});

test("админ-панель не открывается без внутреннего входа", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Раздел только для сотрудников" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Состояние платформы" })).toHaveCount(0);
});

test("клиент сохраняет предложение и открывает его из профиля", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await page.getByRole("searchbox", { name: "Что ищете" }).fill("фото");
  const photoCard = page.getByRole("article").filter({ hasText: "Фото + видео полного свадебного дня" });
  await expect(photoCard).toBeVisible();
  await expect(photoCard.locator("img")).toBeVisible();
  await expect(photoCard.getByText("Автор предложения проверен")).toBeVisible();
  await photoCard.getByRole("button", { name: "Сохранить" }).click();
  await expect(photoCard.getByRole("button", { name: "Убрать из сохранённых" })).toHaveAttribute("aria-pressed", "true");
  await page.locator('a[href="/saved"]:visible').first().click();
  await expect(page).toHaveURL(/\/saved$/);
  await expect(page.getByText("Фото + видео полного свадебного дня")).toBeVisible();
});

test("клиент открывает Маркет и видит товары отдельно от услуг", async ({ page }) => {
  await page.goto("/catalog");
  await expect(page.getByText("Найдено: 100")).toBeVisible();
  await expect(page.getByTestId("service-card")).toHaveCount(100);
  await page.getByRole("button", { name: /^Маркет/ }).click();
  await page.getByLabel("Как получить").selectOption("sale");
  await expect(page.getByText("Свадебный букет из сезонных цветов")).toBeVisible();
  await expect(page.getByText("Фото + видео полного свадебного дня")).toBeHidden();

  await page.getByRole("button", { name: /^Техника/ }).click();
  await expect(page.getByText("Гирлянда тёплого света, 20 метров")).toBeVisible();
  await expect(page.getByText("Свадебный букет из сезонных цветов")).toBeHidden();
});

test("клиент фильтрует каталог по типу события независимо от категории", async ({ page }) => {
  await page.goto("/catalog?event=Тимбилдинг");
  await expect(page.getByLabel("Тип события")).toHaveValue("Тимбилдинг");
  await expect(page.getByText("Практикум для руководителей")).toBeVisible();
  await expect(page.getByText("Ведущий на свадьбу", { exact: true })).toBeHidden();
});

test("клиент открывает полную страницу предложения и увеличивает портфолио", async ({ page }) => {
  await page.goto("/offers/service-orzu-host");
  await expect(page.getByRole("heading", { name: "Ведущий на свадьбу", exact: true })).toBeVisible();
  await expect(page.getByText("Азиз Рахимов")).toBeVisible();
  await expect(page.getByText("Мужчина", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Пакеты и состав" })).toBeVisible();
  await expect(page.getByTestId("offer-portfolio")).toBeVisible();
  await page.getByRole("button", { name: /Увеличить: Ведущий на свадьбу/ }).click();
  await expect(page.getByRole("dialog", { name: "Увеличенная фотография" })).toBeVisible();
  await page.getByRole("button", { name: "Закрыть" }).click();
  await expect(page.getByRole("dialog", { name: "Увеличенная фотография" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Написать автору" }).first()).toHaveAttribute("href", "/chats?service=service-orzu-host");
});

test("поиск понимает разговорное название категории мери ми", async ({ page }) => {
  await page.goto("/catalog");
  await page.getByRole("searchbox", { name: "Что ищете" }).fill("мери ми");
  await expect(page.getByText("Предложение руки и сердца + Love story")).toBeVisible();
  await expect(page.getByTestId("service-card")).toHaveCount(1);
});

test("автор открывает опубликованное предложение глазами клиента", async ({ page }) => {
  await page.goto("/login?role=supplier&next=/supplier");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/onboarding\?/);
  await expect(page.getByRole("radio", { name: /Я предлагаю услуги или товары/ })).toBeChecked();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/supplier$/);
  const customerView = page.getByRole("link", { name: "Посмотреть как клиент" }).first();
  await expect(customerView).toHaveAttribute("target", "_blank");
  const href = await customerView.getAttribute("href");
  expect(href).toMatch(/^\/offers\//);
  await page.goto(href!);
  await expect(page.getByRole("heading", { name: /Банкетный зал Silk Hall/ })).toBeVisible();
});

test("планировщик закрывает категорию и видит прогресс", async ({ page }) => {
  await page.goto("/planner");
  await page.locator("#service-cat-venue").selectOption("service-silk-hall");
  await expect(page.getByLabel(/Готовность/)).toHaveAttribute("aria-label", /17%/);
});

test("клиент пишет автору предложения и получает ответ в чате", async ({ page }) => {
  const clientMessage = "Здравствуйте! Свободен ли зал 20 ноября и что входит в стоимость?";
  const supplierMessage = "Здравствуйте! Дата свободна, сейчас пришлю полный состав предложения.";

  await page.goto("/login");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/catalog$/);

  await page.goto("/catalog");
  const hallCard = page.getByRole("article").filter({ hasText: "Банкетный зал Silk Hall" });
  await hallCard.getByRole("link", { name: "Написать автору" }).click();
  await expect(page).toHaveURL(/\/chats\?service=service-silk-hall/);
  await page.getByLabel("Сообщение").fill(clientMessage);
  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.locator(".chat-message p").filter({ hasText: clientMessage })).toBeVisible();

  await page.goto("/login?role=supplier&next=/supplier");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page.getByRole("radio", { name: /Я предлагаю услуги или товары/ })).toBeChecked();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/supplier$/);
  await page.goto("/chats");
  await page.locator(".chat-list-item").filter({ hasText: clientMessage }).click();
  await page.getByLabel("Сообщение").fill(supplierMessage);
  await page.getByRole("button", { name: "Отправить" }).click();
  await expect(page.locator(".chat-message p").filter({ hasText: supplierMessage })).toBeVisible();

  await page.goto("/login?role=client&next=/chats");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/chats$/);
  await expect(page.locator(".chat-message p").filter({ hasText: supplierMessage })).toBeVisible();
});

test("клиент отправляет расчёт, а автор возвращает новую версию", async ({ page }) => {
  await page.goto("/login?role=client&next=/offers/service-silk-catering");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/offers\/service-silk-catering$/);

  await page.getByRole("button", { name: "Рассчитать", exact: true }).click();
  await page.getByLabel("Дата события").fill("2026-10-18");
  await page.getByLabel("Количество людей").fill("80");
  await expect(page.locator(".estimate-editor-footer strong")).toHaveText("19 200 000 сум");
  await page.getByLabel("Комментарий").fill("Нужно отдельное детское меню на десять гостей.");
  await page.getByRole("button", { name: "Отправить автору", exact: true }).click();

  await expect(page).toHaveURL(/\/chats\?conversation=/);
  await expect(page.getByTestId("estimate-version-1")).toBeVisible();
  await expect(page.getByTestId("estimate-version-1").getByText("Запрос клиента")).toBeVisible();
  await expect(page.getByTestId("estimate-version-1").locator("tfoot")).toContainText("19 200 000 сум");

  await page.goto("/login?role=supplier&next=/chats");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/chats$/);
  await page.getByTestId("estimate-version-1").getByRole("button", { name: "Пересчитать" }).click();
  await page.getByLabel("Цена 1").fill("300000");
  await page.getByRole("button", { name: "Отправить новую версию" }).click({ force: true });

  await expect(page.getByTestId("estimate-version-1")).toBeVisible();
  await expect(page.getByTestId("estimate-version-2")).toBeVisible();
  await expect(page.getByTestId("estimate-version-2").getByText("Расчёт автора")).toBeVisible();
  await expect(page.getByTestId("estimate-version-2").locator("tfoot")).toContainText("24 000 000 сум");
});

test("черновик расчёта сохраняется во время входа", async ({ page }) => {
  await page.goto("/offers/service-silk-catering");
  await page.getByRole("button", { name: "Рассчитать", exact: true }).click();
  await page.getByLabel("Дата события").fill("2026-11-07");
  await page.getByLabel("Количество людей").fill("65");
  await page.getByRole("button", { name: "Войти и отправить" }).click();

  await expect(page).toHaveURL(/\/login\?/);
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page).toHaveURL(/\/offers\/service-silk-catering\?calculator=1$/);
  await expect(page.getByLabel("Дата события")).toHaveValue("2026-11-07");
  await expect(page.getByLabel("Количество людей")).toHaveValue("65");
});

test("администратор фиксирует модерацию и блокировку в аудите", async ({ page }) => {
  await page.goto("/login?role=admin&next=/admin");
  await page.getByRole("button", { name: "Продолжить с Google" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.locator("#reason-moderation-sabo").fill("Цена подтверждена автором 1 сентября");
  await page.getByRole("button", { name: "Одобрить" }).click();
  await expect(page.getByText("Карточка одобрена")).toBeVisible();
  await page.locator("#ban-supplier-sabo-decor").fill("Проверка жалобы клиента");
  await page.getByRole("button", { name: "Заблокировать" }).nth(2).click();
  await expect(page.getByText("Автор предложения заблокирован")).toBeVisible();
});

test("администратор видит сводку и меняет период", async ({ page }) => {
  await page.goto("/login?role=admin&next=/admin");
  await expect(page.getByRole("radio")).toHaveCount(0);
  await page.getByRole("button", { name: "Продолжить с Google" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Состояние платформы" })).toBeVisible();
  await expect(page.getByRole("article").filter({ hasText: "SKU в каталоге" }).locator("strong")).toHaveText("100");
  await expect(page.getByRole("article").filter({ hasText: "Активные пользователи" }).locator("strong")).toHaveText("1");
  await expect(page.getByRole("article").filter({ hasText: "Сейчас онлайн" }).locator("strong")).toHaveText("1");
  await page.getByRole("button", { name: "7 дней" }).click();
  await expect(page.getByText("Последние 7 дней.")).toBeVisible();
});

test("автор предложения загружает Excel и создает непубличный черновик", async ({ page }) => {
  const templateResponse = await page.request.get("/api/templates/services");
  expect(templateResponse.ok()).toBe(true);
  const templateWorkbook = new ExcelJS.Workbook();
  const templateBytes = Uint8Array.from(await templateResponse.body());
  const templateBuffer = Buffer.from(templateBytes) as unknown as Parameters<typeof templateWorkbook.xlsx.load>[0];
  await templateWorkbook.xlsx.load(templateBuffer);
  const templateSheet = templateWorkbook.getWorksheet("Предложения");
  expect(templateSheet?.getCell("E1").value).toBe("offer_kind");
  expect(templateSheet?.getCell("E3").value).toBe("sale");
  expect(templateWorkbook.getWorksheet("Справочники")?.getColumn(1).values).toContain("flowers");

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Предложения");
  sheet.addRow(["external_id", "title_ru", "title_uz", "category", "offer_kind", "city", "description_ru", "description_uz", "price_from", "price_unit", "availability"]);
  sheet.addRow(["TEST-001", "Новый банкетный пакет", "Yangi banket paketi", "catering", "service", "Ташкент", "Меню, обслуживание и базовая сервировка для гостей.", "Mehmonlar uchun menyu, xizmat va asosiy dasturxon bezagi.", 300000, "за гостя", "доступно"]);
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
  const previewLink = page.getByRole("link", { name: "Предпросмотр" });
  const previewHref = await previewLink.getAttribute("href");
  expect(previewHref).toMatch(/^\/offers\/import-.+\?preview=1$/);
  await page.goto(previewHref!);
  await expect(page.getByRole("heading", { name: "Новый банкетный пакет" })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "эту страницу пока видите только вы" })).toBeVisible();
});

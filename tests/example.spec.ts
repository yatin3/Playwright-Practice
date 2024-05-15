import { test, expect } from "@playwright/test";

test.use({ browserName: "chromium" });

test("has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test("get started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();
  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", { name: "Installation" })
  ).toBeVisible();
});

test("check some heading stuff started link", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();
  // Expects page to have a heading with the name of Introduction.
  await expect(
    page.getByRole("heading", { name: "Introduction" })
  ).toBeVisible();
});

test("check html report item on started link", async ({ page }) => {
  await page.goto("https://playwright.dev/", { timeout: 60000 });
  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();
  await page.getByText("How to open the HTML test report").click();
  // Expects page to have a heading with the name of Html Test Report.
  await expect(
    page.getByRole("heading", { name: "HTML Test Reports" })
  ).toBeVisible();
});

//running-the-example-test
test("check text visible with help of id", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  // Click the get started link.
  await page.getByRole("link", { name: "Get started" }).click();

  // Locate the h2 element by its ID.
  const element = page.locator("#running-the-example-test");

  // Assert that the element is visible
  await expect(element).toBeVisible();

  // Assert that the element contains the expected text.
  await expect(element).toHaveText("Running the Example Test");
});

test("check sidebar links", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  await page.getByRole("link", { name: "Get started" }).click();

  //check weather button is redirecting to correct url
  await expect(page).toHaveURL(/.*intro/);

  // Figure out the exact element with exact:true field
  await page.getByRole("link", { name: "Writing tests", exact: true }).click();

  await expect(page).toHaveURL(/.*writing-tests/);

  await page.getByRole("link", { name: "How to use test hooks" }).click();
  await expect(page).toHaveURL(/.*writing-tests#using-test-hooks/);
});

test("check search functionality with xpath", async ({ page }) => {
  await page.goto("https://playwright.dev/");

  await page
    .locator(
      '//*[@id="__docusaurus"]/nav/div[1]/div[2]/div[2]/button/span[1]/span'
    )
    .click();

  await page.locator('input[placeholder="Search docs"]').fill("browser");

  await page.keyboard.press("Enter");

  // Wait for the search results to be displayed
  await page.waitForSelector('ul[role="listbox"], div[role="listbox"], p');

  // Check that the first element containing 'browser' is visible
  const firstResult = page.locator("text=browser").first();
  await expect(firstResult).toBeVisible();
});

test("check mobile responsiveness", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone 6/7/8 dimensions
  await page
    .locator(
      '//*[@id="__docusaurus"]/nav/div[1]/div[2]/div[2]/button'
    )
    .click();

  await expect(page.locator("header")).toBeVisible(); // Check if header is visible
});

test('Community Forums Link Test', async ({page, context}) => {
  await page.goto("https://playwright.dev/");

  const forumsLink = page.locator('//*[@id="__docusaurus"]/footer/div/div[1]/div[2]/ul/li[1]/a');

  await expect(forumsLink).toBeVisible();

  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    forumsLink.click()
  ]);

  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL("https://stackoverflow.com/questions/tagged/playwright");

});

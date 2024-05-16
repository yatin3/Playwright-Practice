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
    .locator('//*[@id="__docusaurus"]/nav/div[1]/div[2]/div[2]/button')
    .click();

  await expect(page.locator("header")).toBeVisible(); // Check if header is visible
});

test("Community Forums Link Test", async ({ page, context }) => {
  await page.goto("https://playwright.dev/");

  const forumsLink = page.locator(
    '//*[@id="__docusaurus"]/footer/div/div[1]/div[2]/ul/li[1]/a'
  );

  await expect(forumsLink).toBeVisible();

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    forumsLink.click(),
  ]);

  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(
    "https://stackoverflow.com/questions/tagged/playwright"
  );
});

test("No Console Errors", async ({ page }) => {
  // create empty array of string
  const errors: string[] = [];

  // store any error that come while loading page on console
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("https://playwright.dev/");
  // Ideally it should not have any error
  expect(errors).toHaveLength(0);
});

test("submit form without authentication", async ({ page }) => {
  await page.goto("https://httpbin.org/forms/post");

  // Fill in the form
  await page.fill('input[name="custname"]', "John Doe");
  await page.fill('input[name="custtel"]', "1234567890");
  await page.fill('input[name="custemail"]', "johndoe@example.com");

  // Submit the form
  await page.click('button:has-text("submit order")');

  // check correct URL is displayed
  await expect(page).toHaveURL("https://httpbin.org/post");
});

test("verify email and password to login", async ({ page }) => {
  // Navigate to the website's main page
  await page.goto("https://www.saucedemo.com/inventory.html");
  
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");

  await page.click('input[name="login-button"]');

  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});

test("add multiple items to cart and verify cart count", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");

  // Log in with credential mention in website
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');

  // Add multiple items to the cart
  await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
  await page.click('button[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');

  await page.waitForSelector('.shopping_cart_badge', { state: 'visible' });

  // Verify the cart count is updated
  const cartCount = await page.locator('.shopping_cart_badge').textContent();
  expect(cartCount).toBe('3');
});

test("remove item from cart and verify cart count", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");

  // Log in
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');

  // Add an item to the cart
  await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');

  // Verify the cart count is 1
  let cartCount = await page.locator('.shopping_cart_badge').textContent();
  expect(cartCount).toBe('1');

  // Remove the item from the cart
  await page.click('button[data-test="remove-sauce-labs-backpack"]');

  // Verify the cart count is removed
  const cartBadge = await page.locator('.shopping_cart_badge');
  await expect(cartBadge).not.toBeVisible();
});

test("verify logout functionality", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");

  // Log in
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');

  // Open the menu and click on Logout
  await page.click('#react-burger-menu-btn');
  await page.click('#logout_sidebar_link');

  // Verify that the user is redirected to the login page
  await expect(page).toHaveURL("https://www.saucedemo.com/");
  await expect(page.locator('input[name="login-button"]')).toBeVisible();
});

test("verify error message for invalid login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");

  // Try to log in with invalid credentials
  await page.fill('input[name="user-name"]', "invalid_user");
  await page.fill('input[name="password"]', "invalid_password");
  await page.click('input[name="login-button"]');

  // Verify the error message is displayed
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toContainText("Epic sadface: Username and password do not match any user in this service");
});

test("verify item details", async ({ page }) => {
  await page.goto("https://www.saucedemo.com");

  // Log in
  await page.fill('input[name="user-name"]', "standard_user");
  await page.fill('input[name="password"]', "secret_sauce");
  await page.click('input[name="login-button"]');

  // Click on a specific item
  await page.click('#item_4_title_link');

  // Verify item details
  const itemName = await page.locator('.inventory_details_name').textContent();
  const itemDesc = await page.locator('.inventory_details_desc').textContent();
  const itemPrice = await page.locator('.inventory_details_price').textContent();

  expect(itemName).toBe("Sauce Labs Backpack");
  expect(itemDesc).toContain("carry.allTheThings() with the sleek");
  expect(itemPrice).toBe("$29.99");
});

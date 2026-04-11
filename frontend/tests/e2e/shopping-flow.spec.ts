import { expect, test } from "@playwright/test";

test("shopping flow with checkpoints", async ({ page }) => {
  await test.step("1) register or log in", async () => {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/checkpoints/01-login.png",
      fullPage: true,
    });

    await expect(
      page.getByRole("heading", { name: /log in|sign in|register|create account/i })
    ).toBeVisible();
  });

  await test.step("2) browse products", async () => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/checkpoints/02-products.png",
      fullPage: true,
    });

    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });

  await test.step("3) add an item to the cart", async () => {
    const addButtons = page.getByRole("button", { name: /add .* to cart/i });
    await expect(addButtons.first()).toBeVisible();
    await addButtons.first().click();
    await page.screenshot({
      path: "test-results/checkpoints/03-added-to-cart.png",
      fullPage: true,
    });

    await expect(page.getByLabel(/shopping cart with \d+ items/i)).toBeVisible();
  });

  await test.step("4) go to checkout and place order", async () => {
    await page.getByLabel(/shopping cart with \d+ items/i).click();
    await expect(page.getByRole("heading", { name: "Shopping Cart" })).toBeVisible();

    await page.getByLabel("Full Name").fill("E2E Test User");
    await page.getByLabel("Email").fill("e2e@example.com");
    await page.getByLabel("Shipping Address").fill("123 Test Street");
    await page.getByLabel("City").fill("Columbus");
    await page.getByLabel("State").selectOption("OH");
    await page.getByLabel("Zip Code").fill("43210");

    await page.getByRole("button", { name: "Place Order" }).click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/checkpoints/04-checkout.png",
      fullPage: true,
    });
  });

  await test.step("5) verify order confirmation appears", async () => {
    await expect(page.getByText("Order placed successfully!")).toBeVisible();
    await page.screenshot({
      path: "test-results/checkpoints/05-confirmation.png",
      fullPage: true,
    });
  });

  await test.step("6) go to order history and verify order is listed", async () => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: "test-results/checkpoints/06-order-history.png",
      fullPage: true,
    });

    await expect(page.getByRole("heading", { name: /order history|my orders/i })).toBeVisible();
    await expect(page.getByText("E2E Test User")).toBeVisible();
  });
});
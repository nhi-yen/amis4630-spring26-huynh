import { expect, test } from "@playwright/test";

interface Product {
  id: number;
  title: string;
}

interface OrderResponse {
  orderId: number;
  confirmationNumber: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("shopping flow with checkpoints", async ({ page }) => {
  const uniqueSuffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const email = `shopping.flow+${uniqueSuffix}@example.com`;
  const password = "Buckeye!12345";
  const shippingFirstName = `Test${uniqueSuffix}`;
  const shippingLastName = "User";
  const shippingEmail = email;
  const shippingStreetAddress = `123 Test Street Apt ${uniqueSuffix}`;
  const shippingCity = "Columbus";
  const shippingState = "OH";
  const shippingZip = "43210";

  await test.step("1) register a new account", async () => {
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();

    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();
    await page.screenshot({
      path: "test-results/checkpoints/01-register.png",
      fullPage: true,
    });

    const registerResponsePromise = page.waitForResponse((response) => {
      return response.request().method() === "POST" && response.url().includes("/api/auth/register");
    });

    await page.getByLabel("Email address").fill(email);
    await page.getByLabel(/^Password$/).fill(password);
    await page.getByLabel("Confirm password").fill(password);

    await Promise.all([
      page.waitForURL("**/login"),
      page.getByRole("button", { name: "Create Account" }).click(),
    ]);

    const registerResponse = await registerResponsePromise;
    expect(registerResponse.status()).toBe(201);
  });

  await test.step("2) log in and land on products", async () => {
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    await page.screenshot({
      path: "test-results/checkpoints/02-login.png",
      fullPage: true,
    });

    const loginResponsePromise = page.waitForResponse((response) => {
      return response.request().method() === "POST" && response.url().includes("/api/auth/login");
    });

    await page.getByLabel("Email address").fill(email);
    await page.getByLabel(/^Password$/).fill(password);

    await Promise.all([
      page.waitForURL("**/"),
      page.getByRole("button", { name: "Sign In" }).click(),
    ]);

    const loginResponse = await loginResponsePromise;
    expect(loginResponse.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });

  await test.step("3) browse products and add one item to cart", async () => {
    const productsResponsePromise = page.waitForResponse((response) => {
      return response.request().method() === "GET" && response.url().includes("/api/products");
    });

    await page.reload();

    const productsResponse = await productsResponsePromise;
    expect(productsResponse.status()).toBe(200);

    const products = (await productsResponse.json()) as Product[];
    expect(products.length).toBeGreaterThan(0);

    const firstProduct = products[0];
    expect(firstProduct.id).toBeGreaterThan(0);
    expect(firstProduct.title.length).toBeGreaterThan(0);

    const addButton = page.getByRole("button", {
      name: new RegExp(`^Add ${escapeRegExp(firstProduct.title)} to cart$`, "i"),
    });

    await expect(addButton).toBeVisible();

    const addToCartResponsePromise = page.waitForResponse((response) => {
      return response.request().method() === "POST" && response.url().includes("/api/cart");
    });

    await addButton.click();
    const addToCartResponse = await addToCartResponsePromise;
    expect(addToCartResponse.status()).toBe(201);

    await page.screenshot({
      path: "test-results/checkpoints/03-added-to-cart.png",
      fullPage: true,
    });

    await expect(page.getByLabel(/shopping cart with 1 items/i)).toBeVisible();
  });

  await test.step("4) review cart and proceed to checkout", async () => {
    await Promise.all([
      page.waitForURL("**/cart"),
      page.getByLabel(/shopping cart with 1 items/i).click(),
    ]);

    await expect(page.getByRole("heading", { name: "Shopping Cart" })).toBeVisible();
    await page.screenshot({
      path: "test-results/checkpoints/04-cart.png",
      fullPage: true,
    });

    await Promise.all([
      page.waitForURL("**/checkout"),
      page.getByRole("link", { name: "Proceed to Checkout" }).click(),
    ]);

    await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  });

  await test.step("5) place the order", async () => {
    await page.getByLabel("First Name").fill(shippingFirstName);
    await page.getByLabel("Last Name").fill(shippingLastName);
    await page.getByLabel("Email").fill(shippingEmail);
    await page.getByLabel("Address").fill(shippingStreetAddress);
    await page.getByLabel("City").fill(shippingCity);
    await page.getByLabel("State").selectOption(shippingState);
    await page.getByLabel("ZIP").fill(shippingZip);

    const orderResponsePromise = page.waitForResponse((response) => {
      return response.request().method() === "POST" && response.url().includes("/api/orders");
    });

    await page.getByRole("button", { name: "Place your order" }).click();

    const orderResponse = await orderResponsePromise;
    expect(orderResponse.status()).toBe(200);
    const order = (await orderResponse.json()) as OrderResponse;

    expect(order.orderId).toBeGreaterThan(0);
    expect(order.confirmationNumber.length).toBeGreaterThan(0);

    await page.screenshot({
      path: "test-results/checkpoints/05-checkout.png",
      fullPage: true,
    });

    await expect(page).toHaveURL(new RegExp(`/order-confirmation/${order.orderId}$`));
    await expect(page.getByRole("heading", { name: "Thanks for your purchase" })).toBeVisible();
    await expect(page.getByText(`Confirmation Number: ${order.confirmationNumber}`)).toBeVisible();
  });

  await test.step("6) verify order appears in order history", async () => {
    const myOrdersResponsePromise = page.waitForResponse((response) => {
      return response.request().method() === "GET" && response.url().includes("/api/orders/mine");
    });

    await Promise.all([
      page.waitForURL("**/orders"),
      page.getByRole("link", { name: "View Order History" }).click(),
    ]);

    const myOrdersResponse = await myOrdersResponsePromise;
    expect(myOrdersResponse.status()).toBe(200);

    await page.screenshot({
      path: "test-results/checkpoints/06-order-history.png",
      fullPage: true,
    });

    await expect(page.getByRole("heading", { name: "My Orders" })).toBeVisible();
    await expect(page.getByText(/Confirmation:/)).toBeVisible();
  });
});
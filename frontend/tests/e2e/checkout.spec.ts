import { test, expect } from "@playwright/test";

interface AuthLoginResponse {
  accessToken: string;
  email: string;
  userId: string;
  roles: string[];
}

interface Product {
  id: number;
  title: string;
  price: number;
}

interface CartAddResponse {
  productId: number;
  quantity: number;
}

interface OrderItemResponse {
  productId: number;
  quantity: number;
  unitPrice: number;
}

interface OrderResponse {
  orderId: number;
  confirmationNumber: string;
  total: number;
  items: OrderItemResponse[];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("happy path checkout flow: register, login, browse, cart, checkout, history", async ({ page }) => {
  const uniqueSuffix = String(Date.now()) + "-" + String(Math.floor(Math.random() * 100000));
  const email = "e2e.checkout+" + uniqueSuffix + "@example.com";
  const password = "Buckeye!12345";
  const shippingFirstName = "Test" + uniqueSuffix;
  const shippingLastName = "User";
  const shippingEmail = email;
  const shippingStreetAddress = "1739 N High St Apt " + uniqueSuffix;
  const shippingCity = "Columbus";
  const shippingState = "OH";
  const shippingZip = "43210";
  const shippingAddress =
    shippingFirstName +
    " " +
    shippingLastName +
    "\n" +
    shippingEmail +
    "\n" +
    shippingStreetAddress +
    "\n" +
    shippingCity +
    ", " +
    shippingState +
    " " +
    shippingZip;

  await page.goto("/login");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.context().clearCookies();

  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();

  await page.getByLabel("Email address").fill(email);
  await page.getByLabel(/^Password$/).fill(password);
  await page.getByLabel("Confirm password").fill(password);

  const registerResponsePromise = page.waitForResponse((response) => {
    return (
      response.request().method() === "POST" &&
      response.url().includes("/api/auth/register")
    );
  });

  await Promise.all([
    page.waitForURL("**/login"),
    page.getByRole("button", { name: "Create Account" }).click(),
  ]);

  const registerResponse = await registerResponsePromise;
  expect(registerResponse.status()).toBe(201);

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.getByLabel("Email address").fill(email);
  await page.getByLabel(/^Password$/).fill(password);

  const loginResponsePromise = page.waitForResponse((response) => {
    return (
      response.request().method() === "POST" &&
      response.url().includes("/api/auth/login")
    );
  });

  await Promise.all([
    page.waitForURL("**/"),
    page.getByRole("button", { name: "Sign In" }).click(),
  ]);

  const loginResponse = await loginResponsePromise;
  expect(loginResponse.status()).toBe(200);

  const loginBody = (await loginResponse.json()) as AuthLoginResponse;
  expect(loginBody.accessToken.length).toBeGreaterThan(20);
  expect(loginBody.email).toBe(email);
  expect(loginBody.userId.length).toBeGreaterThan(0);
  expect(loginBody.roles).toContain("User");

  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  await expect(page.getByTestId("header-admin-link")).toHaveCount(0);

  const productsResponsePromise = page.waitForResponse((response) => {
    return (
      response.request().method() === "GET" &&
      response.url().includes("/api/products")
    );
  });

  await page.reload();

  const productsResponse = await productsResponsePromise;
  expect(productsResponse.status()).toBe(200);

  const products = (await productsResponse.json()) as Product[];
  expect(products.length).toBeGreaterThan(0);

  const firstProduct = products[0];
  expect(firstProduct.id).toBeGreaterThan(0);
  expect(firstProduct.title.length).toBeGreaterThan(0);
  expect(firstProduct.price).toBeGreaterThan(0);

  const addToCartButton = page.getByRole("button", {
    name: new RegExp("^Add " + escapeRegExp(firstProduct.title) + " to cart$", "i"),
  });
  await expect(addToCartButton).toBeVisible();

  const addToCartResponsePromise = page.waitForResponse((response) => {
    return (
      response.request().method() === "POST" &&
      response.url().includes("/api/cart")
    );
  });

  await addToCartButton.click();

  const addToCartResponse = await addToCartResponsePromise;
  expect(addToCartResponse.status()).toBe(201);

  const cartBody = (await addToCartResponse.json()) as CartAddResponse;
  expect(cartBody.productId).toBe(firstProduct.id);
  expect(cartBody.quantity).toBe(1);

  await expect(page.getByLabel(/shopping cart with 1 items/i)).toBeVisible();

  await Promise.all([
    page.waitForURL("**/cart"),
    page.getByLabel(/shopping cart with 1 items/i).click(),
  ]);

  await expect(page.getByRole("heading", { name: "Shopping Cart" })).toBeVisible();
  await expect(page.getByText(firstProduct.title)).toBeVisible();

  await Promise.all([
    page.waitForURL("**/checkout"),
    page.getByRole("link", { name: "Proceed to Checkout" }).click(),
  ]);

  await expect(page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  await page.getByLabel("First Name").fill(shippingFirstName);
  await page.getByLabel("Last Name").fill(shippingLastName);
  await page.getByLabel("Email").fill(shippingEmail);
  await page.getByLabel("Address").fill(shippingStreetAddress);
  await page.getByLabel("City").fill(shippingCity);
  await page.getByLabel("State").selectOption(shippingState);
  await page.getByLabel("ZIP").fill(shippingZip);

  const placeOrderResponsePromise = page.waitForResponse((response) => {
    return (
      response.request().method() === "POST" &&
      response.url().includes("/api/orders")
    );
  });

  await page.getByRole("button", { name: "Place your order" }).click();

  const placeOrderResponse = await placeOrderResponsePromise;
  expect(placeOrderResponse.status()).toBe(200);

  const orderRequestBody = placeOrderResponse.request().postDataJSON() as {
    shippingAddress?: string;
    userId?: string;
  };
  expect(orderRequestBody.shippingAddress).toBe(shippingAddress);
  expect("userId" in orderRequestBody).toBe(false);

  const createdOrder = (await placeOrderResponse.json()) as OrderResponse;
  expect(createdOrder.orderId).toBeGreaterThan(0);
  expect(createdOrder.confirmationNumber.length).toBeGreaterThan(0);
  expect(createdOrder.total).toBeGreaterThan(0);
  expect(createdOrder.items.length).toBeGreaterThan(0);
  expect(createdOrder.items[0].productId).toBe(firstProduct.id);

  await expect(page).toHaveURL(new RegExp("/order-confirmation/" + String(createdOrder.orderId) + "$"));
  await expect(page.getByRole("heading", { name: "Thanks for your purchase" })).toBeVisible();
  await expect(page.getByText("Confirmation Number: " + createdOrder.confirmationNumber)).toBeVisible();

  const myOrdersResponsePromise = page.waitForResponse((response) => {
    return (
      response.request().method() === "GET" &&
      response.url().includes("/api/orders/mine")
    );
  });

  await Promise.all([
    page.waitForURL("**/orders"),
    page.getByRole("link", { name: "View Order History" }).click(),
  ]);

  const myOrdersResponse = await myOrdersResponsePromise;
  expect(myOrdersResponse.status()).toBe(200);

  const myOrdersRequestUrl = myOrdersResponse.request().url();
  expect(myOrdersRequestUrl.includes("userId=")).toBe(false);

  await expect(page.getByRole("heading", { name: "My Orders" })).toBeVisible();
  await expect(page.getByText("Confirmation: " + createdOrder.confirmationNumber)).toBeVisible();
  await expect(page.getByText("Product #" + String(firstProduct.id))).toBeVisible();
});
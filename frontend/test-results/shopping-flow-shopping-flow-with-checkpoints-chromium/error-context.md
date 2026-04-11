# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shopping-flow.spec.ts >> shopping flow with checkpoints
- Location: tests\e2e\shopping-flow.spec.ts:3:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /log in|sign in|register|create account/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /log in|sign in|register|create account/i })

```

# Page snapshot

```yaml
- banner [ref=e3]:
  - generic [ref=e4]:
    - generic [ref=e5]: 🏈
    - generic [ref=e6]: Buckeye Marketplace
  - link "Shopping cart with 0 items" [ref=e7] [cursor=pointer]:
    - /url: /cart
    - text: 🛒
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("shopping flow with checkpoints", async ({ page }) => {
  4  |   await test.step("1) register or log in", async () => {
  5  |     await page.goto("/login");
  6  |     await page.waitForLoadState("networkidle");
  7  |     await page.screenshot({
  8  |       path: "test-results/checkpoints/01-login.png",
  9  |       fullPage: true,
  10 |     });
  11 | 
  12 |     await expect(
  13 |       page.getByRole("heading", { name: /log in|sign in|register|create account/i })
> 14 |     ).toBeVisible();
     |       ^ Error: expect(locator).toBeVisible() failed
  15 |   });
  16 | 
  17 |   await test.step("2) browse products", async () => {
  18 |     await page.goto("/");
  19 |     await page.waitForLoadState("networkidle");
  20 |     await page.screenshot({
  21 |       path: "test-results/checkpoints/02-products.png",
  22 |       fullPage: true,
  23 |     });
  24 | 
  25 |     await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  26 |   });
  27 | 
  28 |   await test.step("3) add an item to the cart", async () => {
  29 |     const addButtons = page.getByRole("button", { name: /add .* to cart/i });
  30 |     await expect(addButtons.first()).toBeVisible();
  31 |     await addButtons.first().click();
  32 |     await page.screenshot({
  33 |       path: "test-results/checkpoints/03-added-to-cart.png",
  34 |       fullPage: true,
  35 |     });
  36 | 
  37 |     await expect(page.getByLabel(/shopping cart with \d+ items/i)).toBeVisible();
  38 |   });
  39 | 
  40 |   await test.step("4) go to checkout and place order", async () => {
  41 |     await page.getByLabel(/shopping cart with \d+ items/i).click();
  42 |     await expect(page.getByRole("heading", { name: "Shopping Cart" })).toBeVisible();
  43 | 
  44 |     await page.getByLabel("Full Name").fill("E2E Test User");
  45 |     await page.getByLabel("Email").fill("e2e@example.com");
  46 |     await page.getByLabel("Shipping Address").fill("123 Test Street");
  47 |     await page.getByLabel("City").fill("Columbus");
  48 |     await page.getByLabel("State").selectOption("OH");
  49 |     await page.getByLabel("Zip Code").fill("43210");
  50 | 
  51 |     await page.getByRole("button", { name: "Place Order" }).click();
  52 |     await page.waitForLoadState("networkidle");
  53 |     await page.screenshot({
  54 |       path: "test-results/checkpoints/04-checkout.png",
  55 |       fullPage: true,
  56 |     });
  57 |   });
  58 | 
  59 |   await test.step("5) verify order confirmation appears", async () => {
  60 |     await expect(page.getByText("Order placed successfully!")).toBeVisible();
  61 |     await page.screenshot({
  62 |       path: "test-results/checkpoints/05-confirmation.png",
  63 |       fullPage: true,
  64 |     });
  65 |   });
  66 | 
  67 |   await test.step("6) go to order history and verify order is listed", async () => {
  68 |     await page.goto("/orders");
  69 |     await page.waitForLoadState("networkidle");
  70 |     await page.screenshot({
  71 |       path: "test-results/checkpoints/06-order-history.png",
  72 |       fullPage: true,
  73 |     });
  74 | 
  75 |     await expect(page.getByRole("heading", { name: /order history|my orders/i })).toBeVisible();
  76 |     await expect(page.getByText("E2E Test User")).toBeVisible();
  77 |   });
  78 | });
```
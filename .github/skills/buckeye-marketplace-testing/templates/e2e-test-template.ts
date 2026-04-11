import { test, expect } from '@playwright/test';

/**
 * E2E tests for Buckeye Marketplace using Playwright.
 * Pattern: Arrange (goto) + Act (user interactions) + Assert (assertions)
 * 
 * CRITICAL:
 * - No mocks — tests real browser and real backend API
 * - Start backend on https://localhost:5001 before running
 * - Start frontend on http://localhost:5173 before running
 * - Use role-based selectors for accessibility
 * - Wait for network idle when data is loaded
 */

// Before all tests: ensure we're testing against running servers
test.beforeAll(async () => {
  // In CI/CD, start servers here. For local development, run them manually.
  console.log('Testing against:');
  console.log('  Frontend: http://localhost:5173');
  console.log('  Backend API: https://localhost:5001/api');
});

test.describe('Shopping Flow', () => {
  test('Happy Path - User browses products and adds to cart', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    
    // ACT: Navigate to products page
    await page.waitForLoadState('networkidle');
    
    // Assert products are loaded
    const heading = page.getByRole('heading', { name: /products/i });
    await expect(heading).toBeVisible();
    
    // ACT: Find first product card and click add to cart
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await expect(firstProductCard).toBeVisible();
    
    const addToCartButton = firstProductCard.getByRole('button', { name: /add to cart/i });
    await addToCartButton.click();
    
    // ASSERT: Cart badge shows 1 item
    await page.waitForTimeout(500); // Allow badge update
    const cartBadge = page.getByLabel(/items? in cart/i);
    await expect(cartBadge).toContainText('1');
  });

  test('User can view product details before adding to cart', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // ACT: Click on a product to view details
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.getByRole('link', { name: /view details/i }).click();
    
    // ASSERT: Product detail page shows correct data
    await page.waitForLoadState('networkidle');
    const title = page.getByRole('heading', { level: 1 });
    await expect(title).toContainText(/\w+/); // Has some title
    
    const price = page.getByText(/\$[\d.]+/);
    await expect(price).toBeVisible();
    
    const description = page.getByText(/description/i);
    await expect(description).toBeVisible();
  });

  test('User can add multiple products to cart', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // ACT: Add first product
    let addButtons = page.getByRole('button', { name: /add to cart/i });
    await addButtons.first().click();
    
    // ASSERT: Badge shows 1
    let badge = page.getByLabel(/items? in cart/i);
    await expect(badge).toContainText('1');
    
    // ACT: Add second product
    addButtons = page.getByRole('button', { name: /add to cart/i });
    await addButtons.nth(1).click();
    
    // ASSERT: Badge shows 2
    badge = page.getByLabel(/items? in cart/i);
    await expect(badge).toContainText('2');
  });

  test('User can add same product twice (increments quantity)', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // ACT: Get the first product's add button
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    const productName = await firstProductCard
      .getByRole('heading', { level: 3 })
      .textContent();
    
    // Add it twice
    const addButton = firstProductCard.getByRole('button', { name: /add to cart/i });
    await addButton.click();
    await page.waitForTimeout(200);
    await addButton.click();
    
    // ASSERT: Cart badge shows 2
    const badge = page.getByLabel(/items? in cart/i);
    await expect(badge).toContainText('2');
  });

  test('User can navigate to cart and see items', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // ACT: Add a product
    const addButton = page.getByRole('button', { name: /add to cart/i }).first();
    await addButton.click();
    await page.waitForTimeout(200);
    
    // ACT: Click cart badge to navigate to cart
    const cartLink = page.getByRole('link', { name: /cart|shopping cart/i });
    await cartLink.click();
    
    // ASSERT: On cart page
    await page.waitForLoadState('networkidle');
    const cartHeading = page.getByRole('heading', { name: /shopping cart/i });
    await expect(cartHeading).toBeVisible();
    
    // ASSERT: Item is in cart
    const cartItem = page.locator('[data-testid="cart-item"]').first();
    await expect(cartItem).toBeVisible();
  });

  test('User can update item quantity in cart', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Add product
    const addButton = page.getByRole('button', { name: /add to cart/i }).first();
    const productName = await addButton
      .locator('..')
      .getByRole('heading')
      .textContent();
    
    await addButton.click();
    await page.waitForTimeout(200);
    
    // Navigate to cart
    const cartLink = page.getByRole('link', { name: /cart|shopping cart/i });
    await cartLink.click();
    await page.waitForLoadState('networkidle');
    
    // ACT: Increase quantity
    const increaseButton = page.getByLabel(`Increase quantity of ${productName}`);
    await increaseButton.click();
    
    // ASSERT: Quantity increased in UI
    const quantity = page.locator(`[data-testid="quantity"]`).first();
    await expect(quantity).toContainText('2');
  });

  test('User can remove item from cart', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Add product
    const addButton = page.getByRole('button', { name: /add to cart/i }).first();
    const productName = await addButton
      .locator('..')
      .getByRole('heading')
      .textContent();
    
    await addButton.click();
    await page.waitForTimeout(200);
    
    // Navigate to cart
    const cartLink = page.getByRole('link', { name: /cart|shopping cart/i });
    await cartLink.click();
    await page.waitForLoadState('networkidle');
    
    // ACT: Remove the item
    const removeButton = page.getByLabel(`Remove ${productName} from cart`);
    await removeButton.click();
    
    // ASSERT: Cart is now empty
    await page.waitForTimeout(300);
    const emptyMessage = page.getByText(/your cart is empty/i);
    await expect(emptyMessage).toBeVisible();
  });

  test('Total price is calculated correctly', async ({ page }) => {
    // ARRANGE
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
    
    // Add first product and note its price
    const firstCard = page.locator('[data-testid="product-card"]').first();
    const firstPrice = await firstCard.getByText(/\$[\d.]+/).textContent();
    const firstPriceValue = parseFloat(firstPrice?.match(/[\d.]+/) ?? '0');
    
    const addButton = firstCard.getByRole('button', { name: /add to cart/i });
    await addButton.click();
    await page.waitForTimeout(200);
    
    // Add second product and note its price
    const secondCard = page.locator('[data-testid="product-card"]').nth(1);
    const secondPrice = await secondCard.getByText(/\$[\d.]+/).textContent();
    const secondPriceValue = parseFloat(secondPrice?.match(/[\d.]+/) ?? '0');
    
    const addButton2 = secondCard.getByRole('button', { name: /add to cart/i });
    await addButton2.click();
    await page.waitForTimeout(200);
    
    // Navigate to cart
    const cartLink = page.getByRole('link', { name: /cart|shopping cart/i });
    await cartLink.click();
    await page.waitForLoadState('networkidle');
    
    // ASSERT: Total is correct
    const expectedTotal = firstPriceValue + secondPriceValue;
    const totalText = page.getByRole('heading', { name: /total:/i });
    await expect(totalText).toContainText(`$${expectedTotal.toFixed(2)}`);
  });
});

test.describe('Error Scenarios', () => {
  test('Empty cart shows helpful message', async ({ page }) => {
    // ARRANGE & ACT
    await page.goto('http://localhost:5173/cart');
    await page.waitForLoadState('networkidle');
    
    // ASSERT
    const emptyMessage = page.getByText(/your cart is empty/i);
    await expect(emptyMessage).toBeVisible();
    
    const browseLink = page.getByRole('link', { name: /browse products/i });
    await expect(browseLink).toBeVisible();
  });
});

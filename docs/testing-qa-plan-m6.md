# Milestone 6 Testing & Quality Assurance Plan

## 1) Test Scope

This plan covers the Milestone 6 rubric for:

- End-to-end testing
- User flows: browse -> cart -> checkout -> order
- Admin flows: product management and order management
- Cross-browser coverage
- Mobile responsiveness checks
- Bug fixes discovered from testing

## 2) Test Environments

- Frontend URL (production): https://marketplace-frontend-nhi2.azurewebsites.net/
- Backend URL (production): https://marketplace-backened-nhi2-gxb5gpcthkcqcja9.canadacentral-01.azurewebsites.net/
- Local E2E stack:
  - Frontend: http://localhost:5173
  - Backend: http://localhost:5000

## 3) Test Strategy

- Automated frontend component/unit tests: Vitest + React Testing Library
- Automated backend unit/integration tests: xUnit
- Automated E2E tests: Playwright (tests in `frontend/tests/e2e`)
- Manual exploratory checks: production browser and mobile viewport checks

## 4) Test Cases (Rubric Mapping)

### 4.1 User Flow Tests

- U1: Browse product catalog
  - Steps: Open homepage, verify product cards and prices are visible.
  - Expected: Product list loads from `/api/products`.
- U2: Product detail
  - Steps: Open a product card.
  - Expected: Product detail page loads with metadata and image.
- U3: Add to cart
  - Steps: Add item from list/detail page.
  - Expected: Cart count increments and item appears in cart page.
- U4: Checkout
  - Steps: Authenticate, go to checkout, complete shipping form, place order.
  - Expected: Order confirmation page appears with confirmation number.
- U5: Order history
  - Steps: Open `/orders` after placing order.
  - Expected: Newly created order appears in order history.

### 4.2 Admin Flow Tests

- A1: Admin login and admin routes
  - Steps: Login as admin, open `/admin`.
  - Expected: Admin dashboard is accessible.
- A2: Product management
  - Steps: Create product, edit product, delete product.
  - Expected: Changes persist and are visible in admin product table.
- A3: Order management
  - Steps: Open admin orders, update order status.
  - Expected: Status update succeeds and persists.

### 4.3 Cross-Browser Tests

- B1: Chrome/Chromium
- B2: Edge
- B3: Firefox
- B4: Safari equivalent (Playwright WebKit)

For each browser:

- Open homepage
- Login
- Add to cart
- Checkout
- Verify order history

### 4.4 Mobile Responsiveness Tests

- M1: 390x844 viewport (iPhone 12-ish)
- M2: 412x915 viewport (Pixel-ish)
- M3: 768x1024 viewport (tablet)

For each viewport:

- Header/navigation is usable
- Product grid/cards do not overflow
- Cart/checkout forms are usable without horizontal scrolling
- Buttons and inputs remain tappable and readable

## 5) Execution Commands

### Frontend tests

```bash
cd frontend
npm run test:run -- --passWithNoTests
```

### Backend tests

```bash
dotnet test backend/BuckeyeMarketplaceApi.Tests/BuckeyeMarketplaceApi.Tests.csproj --configuration Release -p:NuGetAudit=false
```

### E2E tests

```bash
cd frontend
npx playwright test
```

Optional (target browser project):

```bash
npx playwright test --project=chromium
```

## 6) Current Results Snapshot

- Frontend test suite: PASS (25 tests)
- Backend test suite: PASS (18 tests)
- Backend CI/CD latest: PASS
- Frontend CI/CD latest: PASS
- Production smoke checks: PASS (login, browse, add to cart, API reachability)

## 7) Bugs Found During M6 Testing and Fixes

- Bug: Frontend showed "Failed to load products" in external browsers due to localhost API usage in bundled pages.
  - Fix: Updated product list/detail pages to use deployed `API_BASE_URL`.
  - Commit: `ab498b5`

- Bug: Login returned HTTP 500 in production due to JWT key runtime mismatch/size issue.
  - Fix: Updated app settings and restart; verified register/login/cart flow.

- Bug: Backend CI build_test failed when integration tests required JWT key in CI.
  - Fix: Added CI/testing fallback JWT key in `Program.cs`.
  - Commit: `23a50a4`

- Bug: Backend CI failed due to restore/audit behavior noise in runner environment.
  - Fix: Stabilized workflow command args for CI.
  - Commit: `67dd861`

- Bug: Frontend deploy repeatedly failed from publish-profile credential policy and secret issues.
  - Fix: Enabled publishing credential policies and refreshed publish profile secrets.

## 8) Evidence Checklist for Submission

- [x] Link to latest green Frontend CI/CD run: https://github.com/nhi-yen/amis4630-spring26-huynh/actions/runs/25230207638
- [x] Link to latest green Backend CI/CD run: https://github.com/nhi-yen/amis4630-spring26-huynh/actions/runs/25230020225
- [x] Screenshot set captured and stored in `docs/screenshots/`.

### 8.1 Stored Evidence Files

All screenshots are in `docs/screenshots/`.

**User flow (desktop Chromium, 1440×900):**
- [user-flow-01-homepage.png](docs/screenshots/user-flow-01-homepage.png) — Homepage with product catalog
- [user-flow-02-api-products.png](docs/screenshots/user-flow-02-api-products.png) — Backend `/api/products` JSON response
- [user-flow-03-cart.png](docs/screenshots/user-flow-03-cart.png) — Cart with item added
- [user-flow-04-checkout-filled.png](docs/screenshots/user-flow-04-checkout-filled.png) — Checkout form filled
- [user-flow-05-order-confirmation.png](docs/screenshots/user-flow-05-order-confirmation.png) — Order confirmation page
- [user-flow-06-order-history.png](docs/screenshots/user-flow-06-order-history.png) — Order history listing
- [user-flow-07-admin-products.png](docs/screenshots/user-flow-07-admin-products.png) — Admin product management table
- [user-flow-08-admin-orders.png](docs/screenshots/user-flow-08-admin-orders.png) — Admin order management with status controls

**Cross-browser (desktop 1440×900):**
- [cross-browser-home-chromium.png](docs/screenshots/cross-browser-home-chromium.png)
- [cross-browser-home-firefox.png](docs/screenshots/cross-browser-home-firefox.png)
- [cross-browser-home-webkit.png](docs/screenshots/cross-browser-home-webkit.png) — Safari-equivalent

**Mobile (iPhone 13 profile via Playwright):**
- [mobile-home-iphone13.png](docs/screenshots/mobile-home-iphone13.png)
- [mobile-authenticated-home-iphone13.png](docs/screenshots/mobile-authenticated-home-iphone13.png)
- [mobile-admin-dashboard-iphone13.png](docs/screenshots/mobile-admin-dashboard-iphone13.png)

**CI/CD runs:**
- [ci-workflow-runs-overview.png](docs/screenshots/ci-workflow-runs-overview.png)
- [ci-frontend-run-success.png](docs/screenshots/ci-frontend-run-success.png)
- [ci-backend-run-success.png](docs/screenshots/ci-backend-run-success.png)

## 9) Rubric Alignment Statement

This testing plan and execution evidence provide:

- End-to-end flow coverage
- Admin workflow coverage
- Cross-browser + responsive checks
- Documented bug discovery/fix trail

## 10) Test Source Links

The following committed test assets back this plan:

### Frontend E2E Specs

- [checkout.spec.ts](../frontend/tests/e2e/checkout.spec.ts)
- [shopping-flow.spec.ts](../frontend/tests/e2e/shopping-flow.spec.ts)

### Frontend Checkpoint Outputs

- [frontend/test-results/checkpoints](../frontend/test-results/checkpoints/)

### Backend Controller Tests

- [CartControllerTests.cs](../backend/BuckeyeMarketplaceApi.Tests/Controllers/CartControllerTests.cs)
- [CartController_AddToCart_DuplicateMergeLogicTests.cs](../backend/BuckeyeMarketplaceApi.Tests/Controllers/CartController_AddToCart_DuplicateMergeLogicTests.cs)
- [CartController_AddToCart_ProductNotFoundTests.cs](../backend/BuckeyeMarketplaceApi.Tests/Controllers/CartController_AddToCart_ProductNotFoundTests.cs)

### Backend Integration Tests

- [CartIntegrationTests.cs](../backend/BuckeyeMarketplaceApi.Tests/Integration/CartIntegrationTests.cs)
- [OrdersIntegrationTests.cs](../backend/BuckeyeMarketplaceApi.Tests/Integration/OrdersIntegrationTests.cs)

### Backend Validator Tests

- [AddToCartRequestValidatorTests.cs](../backend/BuckeyeMarketplaceApi.Tests/Validators/AddToCartRequestValidatorTests.cs)


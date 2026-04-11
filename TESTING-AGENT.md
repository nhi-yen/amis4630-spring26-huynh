# Buckeye Marketplace - Testing Agent Instructions

## Your Testing Infrastructure

### Backend Testing
**Project:** `backend/BuckeyeMarketplaceApi/BuckeyeMarketplaceApi.csproj` (Target: .NET 10.0)

**Framework Recommendation:** xUnit + Moq + FluentAssertions
- **Unit Test Command:** `dotnet test backend/BuckeyeMarketplaceApi.Tests/ --configuration Debug`
- **Integration Test Command:** `dotnet test backend/BuckeyeMarketplaceApi.Tests/ --filter Category=Integration --configuration Debug`
- **Run All Backend Tests:** `dotnet test backend/`

**Test Project Location:** `backend/BuckeyeMarketplaceApi.Tests/` (does not exist yet - will be created)

**Key Directories to Inspect Before Writing Tests:**
- `backend/BuckeyeMarketplaceApi/Controllers/` - API endpoints (ProductsController, CartController)
- `backend/BuckeyeMarketplaceApi/Data/` - Database context (MarketplaceContext)
- `backend/BuckeyeMarketplaceApi/Models/` - Domain entities (Product, Cart, CartItem)
- `backend/BuckeyeMarketplaceApi/Dtos/` - Data transfer objects
- `backend/BuckeyeMarketplaceApi/Validators/` - FluentValidation validators

**Assertion Style (REQUIRED):** FluentAssertions
```csharp
// DO THIS:
result.Should().NotBeNull();
result.Should().HaveCount(5);
result.First().Id.Should().Be(expectedId);

// NEVER DO THIS:
Assert.NotNull(result);  // Weak assertion
```

**CRITICAL RULE:** Never weaken assertions to make tests pass. If a test fails, the code is wrong, not the test.

---

### Frontend Testing
**Project:** `frontend/` (React 19 + TypeScript + Vite)

**Framework Recommendation:** Vitest + React Testing Library
- **Unit/Component Test Command:** `cd frontend && npm test -- --run`
- **Watch Mode:** `cd frontend && npm test`
- **Coverage:** `cd frontend && npm test -- --coverage`

**Test File Locations:**
- Component tests: `frontend/src/components/**/__tests__/ComponentName.test.tsx`
- Service tests: `frontend/src/services/__tests__/serviceName.test.ts`
- Reducer tests: `frontend/src/reducers/__tests__/reducerName.test.ts`
- Hook tests: `frontend/src/hooks/__tests__/hookName.test.ts`

**Key Directories to Inspect Before Writing Tests:**
- `frontend/src/components/` - All React components (ProductCard, AddToCartButton, CartPage, etc.)
- `frontend/src/services/` - API calls (cartApi.ts)
- `frontend/src/reducers/` - State management (cartReducer.ts)
- `frontend/src/contexts/` - Context providers (CartContext.tsx)
- `frontend/src/types/` - Type definitions

**Assertion Style (REQUIRED):** @testing-library/jest-dom
```typescript
// DO THIS:
expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
expect(element).toHaveTextContent('$29.99');
expect(input).toHaveValue('5');

// NEVER DO THIS:
expect(element).toBeTruthy();  // Too weak for UI testing
```

---

### End-to-End Testing
**Framework Recommendation:** Playwright
- **Run All E2E Tests:** `cd frontend && npx playwright test`
- **Run Specific Test:** `cd frontend && npx playwright test tests/e2e/productCatalog.spec.ts`
- **Debug Mode:** `cd frontend && npx playwright test --debug`
- **UI Mode:** `cd frontend && npx playwright test --ui`

**E2E Test Location:** `frontend/tests/e2e/` (does not exist yet - will be created)

**Test Files to Create:**
- `frontend/tests/e2e/productCatalog.spec.ts` - Browse products, filters, search
- `frontend/tests/e2e/productDetail.spec.ts` - View details, add to cart
- `frontend/tests/e2e/shopping.spec.ts` - Happy path: browse → add to cart → checkout
- `frontend/tests/e2e/cart.spec.ts` - Cart operations: view, update quantities, remove

**Assertion Style:** Playwright expect()
```typescript
// DO THIS:
await expect(page.getByRole('heading', { name: /products/i })).toBeVisible();
await expect(page.locator('button:has-text("Add to Cart")')).toBeEnabled();

// NEVER DO THIS:
const text = await page.textContent('h1');
if (text.includes('Products')) { ... }  // Can break silently
```

---

## Testing Conventions for This Project

### Unit Tests (Backend)
- **Scope:** Test a single method or small class in isolation
- **Mocks:** All external dependencies (database, APIs) are mocked
- **Naming:** `[MethodName]_[Scenario]_[ExpectedResult]`
- **Example:** `Add_WithInvalidQuantity_ThrowsValidationException`

### Integration Tests (Backend)
- **Scope:** Test multiple components working together (real database, but in-memory)
- **Setup:** Use InMemory database (`appsettings.Development.json` already configured)
- **Naming:** `[Feature]_[Scenario]_[ExpectedResult]`
- **Example:** `AddToCart_WithValidProduct_IncrementsCartQuantity`

### Component Tests (Frontend)
- **Scope:** Test a single React component with mocked API calls
- **Mocks:** All API calls, context providers mocked
- **Queries:** Always use `getByRole()` or `getByLabelText()` for accessibility
- **Naming:** `[ComponentName] - [Scenario]` or `should [expected behavior]`
- **Example:** `AddToCartButton - disabled when product is out of stock`

### E2E Tests (Frontend)
- **Scope:** Real browser navigation through user workflows
- **No Mocks:** Tests real backend API
- **Selectors:** Prefer role-based queries; use `data-testid` only when necessary
- **Naming:** `[Feature] - [Happy Path | Edge Case]`
- **Example:** `Shopping Flow - User browses products and adds item to cart`

---

## Before Writing Any Test

1. **Read the code under test** — Understand the business logic first
2. **Identify dependencies** — What does this unit depend on? Mock them.
3. **Define success criteria** — What should happen? What shouldn't?
4. **Write the test first** — Follow Test-Driven Development (TDD) when possible
5. **Make it fail** — Ensure test catches real bugs
6. **Make it pass** — Minimal code change
7. **Refactor** — Improve code, tests should still pass

---

## Project-Specific Notes

- **Database:** Uses InMemory for development (no real SQL Server needed for tests)
- **Authentication:** Not yet implemented (M5) — tests should handle unauthenticated scenarios
- **API Base Path:** `/api/` — all backend tests should use this
- **Frontend Port:** `http://localhost:5173` — E2E tests target this
- **Backend Port:** `https://localhost:5001` — API calls use this

---

## RULES FOR COPILOT

1. **Never weaken assertions** — If tests fail, fix the code, not the test
2. **Always include types** — Backend: full type in arrange phase; Frontend: typed mocks
3. **Always handle async** — Backend: `async Task`; Frontend: `waitFor()` or `screen.findBy()`
4. **Always use accessibility attributes** — Frontend: role, label, aria attributes
5. **Always explain test purpose** — Comments for non-obvious test scenarios
6. **Never skip edge cases** — null, empty, boundary values are critical
7. **Never test implementation details** — Test behavior, not `setState()` calls
8. **Test frameworks must be installed before running tests** — See setup section below

---

## Setup (Initial One-Time)

### Backend Test Framework Setup
```bash
cd backend
dotnet new xunit -n BuckeyeMarketplaceApi.Tests
cd BuckeyeMarketplaceApi.Tests
dotnet add package Moq
dotnet add package FluentAssertions
cd ../..
dotnet add reference BuckeyeMarketplaceApi/BuckeyeMarketplaceApi.csproj
```

### Frontend Test Framework Setup
```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui
npm install -D @types/node
# Create vite.config.ts or update existing to include Vitest config
```

### E2E Test Framework Setup
```bash
cd frontend
npm install -D @playwright/test
npx playwright install
npx playwright codegen http://localhost:5173  # Generate E2E script structure
```

---

## How to Use This Agent

When prompting Copilot with this agent active:

### For Backend Tests:
> I need unit tests for [Controller/Service]. Here's what it does: [brief description]

### For Frontend Tests:
> I need tests for the [Component]. It should [behavior]. The component uses these APIs: [API calls]

### For E2E Tests:
> Write an E2E test for [scenario]. The happy path is: [user steps]

### To Get Test Recommendations:
> Analyze our codebase and recommend the best candidates for:
> 1. Three backend unit tests
> 2. One backend integration test
> 3. Three frontend component tests
> 4. One E2E happy-path test
> Return only a brief plan with file targets and why each test matters.

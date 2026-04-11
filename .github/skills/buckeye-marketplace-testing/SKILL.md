---
name: buckeye-marketplace-testing
description: "Multi-tier testing strategy for Buckeye Marketplace. Use when: designing test plans, setting up test frameworks, writing unit/integration/component/E2E tests, analyzing code coverage, debugging failing tests. Includes xUnit/Moq backend tests, Vitest/RTL frontend tests, and Playwright E2E automation."
argument-hint: "What should we test? (e.g., 'CartController.AddToCart', 'cartReducer', 'shopping flow')"
user-invocable: true
disable-model-invocation: false
---

# Buckeye Marketplace Testing Skill

## When to Use

- **📋 Planning**: Decide what to test and prioritize test targets
- **🛠️ Setup**: Install frameworks, create project structure, configure test runners
- **✍️ Writing**: Generate unit tests, integration tests, component tests, or E2E tests
- **🔍 Debugging**: Fix failing tests or flaky tests
- **📊 Analysis**: Review coverage gaps or test results

## Core Philosophy

**Tests are the specification.** Never weaken assertions to make tests pass. If a test fails, the code is wrong—fix the code, not the test.

---

## Testing Pyramid for Buckeye Marketplace

```
        📱 E2E (Few, Real Browser)
    🧩 Component Tests (Many, Mocked APIs)
Unit Tests (Most, Isolated, Mocked Dependencies)
```

| Layer | Framework | Scope | When to Mock | Example |
|-------|-----------|-------|--------------|---------|
| **Unit** | xUnit + Moq | Single method in isolation | All external dependencies | `CartValidator.Validate()` |
| **Integration** | xUnit + real InMemory DB | Multiple components + DB | Nothing (real DB for .NET tests) | `AddToCart workflow` end-to-end |
| **Component** | Vitest + RTL | Single React component | API calls, context providers | `CartPage` rendering with fake data |
| **E2E** | Playwright | Real browser, real backend | Nothing (full integration) | User adds product to cart and checks out |

---

## Procedure: Planning Tests

### Step 1: Identify Code Under Test
Read the code. Ask:
- What does this method/component do?
- What are the inputs? What are the outputs?
- What can fail? (null input, empty list, network error, validation failure)
- What side effects happen? (database write, state change, API call)

### Step 2: Choose Test Type
Use the decision tree:

```
Is it a service, controller, validator, utility function?
├─ YES → Unit Test (mock all dependencies)
├─ NO

Does it need a real database or interact with multiple services?
├─ YES → Integration Test (use real InMemory DB)
├─ NO

Is it a React component?
├─ YES → Component Test (mock API calls and context)
├─ NO

Is it a full user workflow?
├─ YES → E2E Test (real browser, real API)
├─ NO → Don't test (internal detail)
```

### Step 3: Identify Test Cases
For each code path, write one test. Minimum cases:

- **Happy path**: Normal input, expected output
- **Invalid input**: Null, empty, out of range → error handling
- **Edge cases**: Boundary values (0, -1, 999), empty collections
- **Side effects**: Was the database updated? Was state changed? Was an API called?

### Step 4: Write Test Names
Follow the pattern: `[MethodName]_[Scenario]_[ExpectedResult]`

Examples:
- `AddToCart_WithNewProduct_AddsProductToCart`
- `cartReducer_ADD_TO_CART_WithExistingProduct_IncrementsQuantity`
- `CartPage_WithEmptyCart_ShowsEmptyMessage`
- `ShoppingFlow_HappyPath_UserBrowsesAddsToCartAndCheckout`

### Step 5: Arrange-Act-Assert (AAA)

Every test follows this structure:

```
arrange:    Set up test data, mocks, and initial state
act:        Call the code under test
assert:     Verify the output and side effects
```

See [Unit Test Template](./templates/unit-test-template.cs) and [Component Test Template](./templates/component-test-template.tsx)

---

## Procedure: Setting Up Frameworks

### Backend: xUnit + Moq + FluentAssertions

```bash
cd backend
dotnet new xunit -n BuckeyeMarketplaceApi.Tests
cd BuckeyeMarketplaceApi.Tests
dotnet add package Moq
dotnet add package FluentAssertions
cd ..
dotnet add reference ../BuckeyeMarketplaceApi/BuckeyeMarketplaceApi.csproj
dotnet build
```

**Test Command:**
```bash
dotnet test backend/                              # All tests
dotnet test backend/ --configuration Debug        # Debug output
dotnet test backend/ --filter "Category=Unit"     # Only unit tests
dotnet test backend/ --filter "Category=Integration"  # Only integration tests
```

### Frontend: Vitest + React Testing Library

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom @vitest/ui
npm install -D @testing-library/user-event ts-node
npx vitest --init  # Create vitest.config.ts
```

**Test Commands:**
```bash
cd frontend
npm test -- --run                  # Run once
npm test                           # Watch mode
npm test -- --coverage             # Coverage report
npm test -- --ui                   # UI dashboard
```

### E2E: Playwright

```bash
cd frontend
npm install -D @playwright/test
npx playwright install             # Download browsers
npx playwright codegen http://localhost:5173  # Generate test script
```

**Test Commands:**
```bash
cd frontend
npx playwright test                # Run all E2E tests
npx playwright test tests/e2e/shopping.spec.ts  # Specific test
npx playwright test --debug        # Debug mode (step through)
npx playwright test --ui           # UI mode (interactive)
```

---

## Procedure: Writing Tests

### For Backend (Unit Test)

Use [Unit Test Template](./templates/unit-test-template.cs):

```csharp
[Fact(DisplayName = "Name_Scenario_Expected")]
public async Task MethodName_Scenario_ExpectedResult()
{
    // ARRANGE: Set up test data and mocks
    var mockContext = new Mock<MarketplaceContext>();
    var mockValidator = new Mock<IValidator>();
    
    // ACT: Call the code under test
    var result = await sut.Method(input);
    
    // ASSERT: Verify output and behavior
    result.Should().NotBeNull();
    mockValidator.Verify(v => v.Validate(It.IsAny<object>()), Times.Once);
}
```

**Assertion Style (FluentAssertions):**
```csharp
// Boolean
result.Should().BeTrue();
result.Should().BeFalse();

// Nullability
result.Should().BeNull();
result.Should().NotBeNull();

// Collections
items.Should().HaveCount(5);
items.Should().BeEmpty();
items.Should().Contain(item);

// Numbers
count.Should().Be(10);
price.Should().BeGreaterThan(0);
```

### For Frontend (Component Test)

Use [Component Test Template](./templates/component-test-template.tsx):

```typescript
describe('CartPage', () => {
  it('should render empty cart message when items is empty', async () => {
    // ARRANGE
    const { getByText } = render(<CartPage />);
    
    // ACT
    // (render is the act)
    
    // ASSERT
    const emptyMessage = getByText(/your cart is empty/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});
```

**Assertion Style (React Testing Library + @testing-library/jest-dom):**
```typescript
// DOM presence
expect(element).toBeInTheDocument();
expect(element).toHaveClass('active');
expect(element).toHaveAttribute('disabled');

// Text content
expect(element).toHaveTextContent('Hello');
expect(element).toHaveValue('input text');

// Visibility
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Accessibility
expect(screen.getByRole('button', { name: /add/i })).toBeEnabled();
```

**Always use role-based queries:**
```typescript
// ✅ YES: Role-based, accessible, future-proof
screen.getByRole('button', { name: /add to cart/i })
screen.getByRole('heading', { level: 1 })
screen.getByLabelText(/quantity/i)

// ❌ NO: Implementation detail, brittle
screen.getByTestId('add-button')
container.querySelector('.cart-item')
```

### For E2E (Playwright)

Use [E2E Test Template](./templates/e2e-test-template.ts):

```typescript
test('Shopping Flow - User browses products and adds to cart', async ({ page }) => {
  // ARRANGE + ACT
  await page.goto('http://localhost:5173/');
  
  // ACT
  await page.getByRole('link', { name: /products/i }).click();
  await page.getByRole('heading', { name: /Select a Product/i }).waitFor();
  
  const firstProduct = page.locator('[data-testid="product-card"]').first();
  await firstProduct.getByRole('button', { name: /add to cart/i }).click();
  
  // ASSERT
  const badge = page.getByLabel(/cart items/i);
  await expect(badge).toContainText('1');
});
```

**Playwright Common Patterns:**
```typescript
// Navigation
await page.goto('http://localhost:5173');
await page.getByRole('link', { name: /checkout/i }).click();

// Waiting
await page.waitForLoadState('networkidle');
await expect(page.getByText('Loading')).not.toBeVisible();

// Form interaction
await page.fill('#email', 'test@example.com');
await page.getByRole('button', { name: /submit/i }).click();

// Assertions
await expect(page).toHaveTitle('Products');
await expect(page.getByRole('heading', { name: /cart/i })).toBeVisible();
```

---

## Procedure: Running Tests & Analyzing Results

### Backend
```bash
dotnet test backend/ --verbosity normal
```

**Interpret output:**
```
Passed:  ✅ All assertions in the test passed
Failed:  ❌ An assertion failed OR an exception was thrown
Skipped: ⏭️ Test has [Fact(Skip="reason")]
```

**If tests fail:**
1. Read the assertion message — What was expected vs. actual?
2. Check the test code — Is the test correct?
3. Check the source code — Is the implementation wrong?
4. Never change the test to pass an incorrect implementation.

### Frontend
```bash
cd frontend && npm test -- --run
```

**Coverage report:**
```bash
npm test -- --coverage
# Opens coverage summary in terminal
# Look for < 80% coverage lines (gaps)
```

### E2E
```bash
cd frontend && npx playwright test
```

**If E2E fails:**
1. Run with `--debug` to step through
2. Use `--ui` for interactive debugging
3. Check backend is running on `https://localhost:5001`
4. Check frontend is running on `http://localhost:5173`

---

## Testing Rules for Buckeye Marketplace

### ✅ DO

- ✅ Test public methods and user-facing behavior
- ✅ Use InMemory database for backend integration tests
- ✅ Mock API calls in component tests
- ✅ Mock external services (validators, repositories) in unit tests
- ✅ Test both success and failure paths
- ✅ Include accessibility attributes in component tests
- ✅ Name tests clearly so they serve as documentation
- ✅ Keep tests fast (< 1s per unit test, < 10s per integration test)

### 🚫 DON'T

- 🚫 **Weaken assertions to make tests pass** — Fix the code
- 🚫 Skip edge cases (null, empty, boundary values)
- 🚫 Test private methods directly
- 🚫 Test implementation details (e.g., `setState()` calls)
- 🚫 Use `setTimeout` in tests — use `waitFor()` instead
- 🚫 Hardcode test data — use fixtures or factories
- 🚫 Use screenshots for assertions (fragile)
- 🚫 Mock database calls in integration tests (defeat the purpose)

---

## Project-Specific Knowledge

### Backend (BuckeyeMarketplaceApi)

**Key Classes to Test:**
- `CartController` — AddToCart, GetCart, UpdateCartItem, RemoveCartItem
- `ProductsController` — GetAllProducts, GetProductById
- `CartValidator`, `AddToCartRequestValidator` — Validation logic
- `Cart`, `Product`, `CartItem` models — Relationships and navigation

**InMemory Database Setup:**
```csharp
var options = new DbContextOptionsBuilder<MarketplaceContext>()
    .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
    .Options;
var context = new MarketplaceContext(options);
```

**Controller Testing Pattern:**
Controllers inject `MarketplaceContext`. Create real context (InMemory) in tests:
```csharp
var controller = new CartController(inMemoryContext);
```

### Frontend (React)

**Key Files to Test:**
- `src/components/CartPage/CartPage.tsx` — Cart UI, item list, quantity controls
- `src/components/AddToCartButton/AddToCartButton.tsx` — Button interaction, loading
- `src/reducers/cartReducer.ts` — State transitions (6 action types)
- `src/services/cartApi.ts` — API calls (should be mocked in component tests)

**Context Mock Pattern:**
```typescript
const mockDispatch = jest.fn();
jest.mock('../../contexts/CartContext', () => ({
  useCartContext: () => ({
    state: { items: [] },
    dispatch: mockDispatch,
  }),
}));
```

### E2E (Playwright)

**Targets:**
- Frontend: `http://localhost:5173`
- Backend: `https://localhost:5001/api`

**Before running E2E:**
```bash
# Terminal 1: Start backend
cd backend && dotnet run --configuration Debug

# Terminal 2: Start frontend
cd frontend && npm run dev

# Terminal 3: Run E2E
cd frontend && npx playwright test
```

---

## Quick Links

- **Setup Guide**: See [Setup](./scripts/setup.sh)
- **Unit Test Template**: [unit-test-template.cs](./templates/unit-test-template.cs)
- **Component Test Template**: [component-test-template.tsx](./templates/component-test-template.tsx)
- **E2E Test Template**: [e2e-test-template.ts](./templates/e2e-test-template.ts)
- **Full Documentation**: [TESTING-AGENT.md](../../../TESTING-AGENT.md)

---

## Example Prompts

### 1. Get a Test Plan
> "Analyze CartController and cartReducer. Recommend 3 unit tests and 1 integration test. Return only file targets and why each matters."

**Output**: Plan with locations and business value

### 2. Write a Specific Test
> "Write a unit test for CartValidator that checks: minimum quantity > 0, product ID is required, quantity cap is 99."

**Output**: Complete, runnable test code

### 3. Set Up Testing
> "Set up the backend test project with xUnit, Moq, and FluentAssertions. Show me the directory structure and one example test."

**Output**: Installed + project created + example test

### 4. Debug a Failing Test
> "This test is failing [paste code and error]. What's wrong?"

**Output**: Root cause analysis + fix

### 5. Run & Report Results
> "Run all backend tests. Report which ones pass/fail and why."

**Output**: Test results with failure analysis

---

**Remember**: Tests are your *safety net*. Write them with confidence. If a test fails, trust the test—the code is the problem, not the test.

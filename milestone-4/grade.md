# Lab Evaluation Report

**Student Repository**: `nhi-yen-amis4630-spring26-huynh`  
**Date**: May 3, 2026  
**Rubric**: `milestone-4/rubric.md`

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                       |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (NuGet warnings only). `dotnet test`: 18/18 pass.                                                                  |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. `vitest --run`: 25/25 pass.                                                                               |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products). POST /api/auth/login → 200 (JWT). POST /api/auth/register → 201. GET /api/cart → 200 (auth required). |

## 1. Project Structure

| Expected                                           | Found                                                                                                                          | Status |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Backend Cart model (`Models/Cart.cs`)              | `backend/BuckeyeMarketplaceApi/Models/Cart.cs`                                                                                 | ✅     |
| Backend CartItem model (`Models/CartItem.cs`)      | `backend/BuckeyeMarketplaceApi/Models/CartItem.cs`                                                                             | ✅     |
| Cart controller (`Controllers/CartController.cs`)  | `backend/BuckeyeMarketplaceApi/Controllers/CartController.cs`                                                                  | ✅     |
| Cart DTOs (`Dtos/CartResponse.cs`, etc.)           | `backend/BuckeyeMarketplaceApi/Dtos/CartResponse.cs`, `CartItemResponse.cs`, `AddToCartRequest.cs`, `UpdateCartItemRequest.cs` | ✅     |
| Validators                                         | `backend/BuckeyeMarketplaceApi/Validators/AddToCartRequestValidator.cs`, `UpdateCartItemRequestValidator.cs`                   | ✅     |
| Frontend cart reducer (`reducers/cartReducer.ts`)  | `frontend/src/reducers/cartReducer.ts`                                                                                         | ✅     |
| Frontend cart context (`contexts/CartContext.tsx`) | `frontend/src/contexts/CartContext.tsx`                                                                                        | ✅     |
| Frontend cart types (`types/cart.ts`)              | `frontend/src/types/cart.ts`                                                                                                   | ✅     |
| Cart API service (`services/cartApi.ts`)           | `frontend/src/services/cartApi.ts`                                                                                             | ✅     |
| CartPage component                                 | `frontend/src/components/CartPage/CartPage.tsx` + `CartPage.module.css`                                                        | ✅     |
| CartBadge component                                | `frontend/src/components/CartBadge/CartBadge.tsx` + `CartBadge.module.css`                                                     | ✅     |
| AddToCartButton component                          | `frontend/src/components/AddToCartButton/AddToCartButton.tsx` + `AddToCartButton.module.css`                                   | ✅     |
| AI usage doc                                       | `docs/ai-usage.md`                                                                                                             | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                              | Points | Status     | Evidence                                                                                                                                                                                                                                                                                                                                            |
| --- | ---------------------------------------- | ------ | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | useReducer or Context API for cart state | 2      | ✅ Met     | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L1-L4) — `useReducer(cartReducer, initialCartState)` with `CartProvider` Context wrapper; [cartReducer.ts](frontend/src/reducers/cartReducer.ts) — dedicated reducer with discriminated union actions                                                                                       |
| 1b  | Add, update quantity, remove operations  | 2      | ✅ Met     | [cartReducer.ts](frontend/src/reducers/cartReducer.ts#L9-L70) — `ADD_TO_CART`, `UPDATE_QUANTITY`, `REMOVE_FROM_CART`, `CLEAR_CART`, `LOAD_CART` action types all handled                                                                                                                                                                            |
| 1c  | Cart count in header + calculated totals | 1      | ✅ Met     | [CartBadge.tsx](frontend/src/components/CartBadge/CartBadge.tsx#L9-L19) — renders `cartItemCount` from context in header badge; [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L51-L57) — `cartItemCount` and `cartTotal` computed via `useMemo`; [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L80) — displays `cartTotal` |
| 2a  | GET /api/cart                            | 1      | ✅ Met     | [CartController.cs](backend/BuckeyeMarketplaceApi/Controllers/CartController.cs#L24-L62) — `[HttpGet]` returns `CartResponse` with items, totals; returns 200 OK                                                                                                                                                                                    |
| 2b  | POST /api/cart (add item)                | 1      | ✅ Met     | [CartController.cs](backend/BuckeyeMarketplaceApi/Controllers/CartController.cs#L64-L113) — `[HttpPost]` with upsert logic (increments existing or creates new); returns 201 CreatedAtAction                                                                                                                                                        |
| 2c  | PUT /api/cart/{cartItemId} (update qty)  | 1      | ✅ Met     | [CartController.cs](backend/BuckeyeMarketplaceApi/Controllers/CartController.cs#L115-L150) — `[HttpPut("{cartItemId}")]` with ownership check; returns 200 OK                                                                                                                                                                                       |
| 2d  | DELETE endpoints (item + clear)          | 1      | ✅ Met     | [CartController.cs](backend/BuckeyeMarketplaceApi/Controllers/CartController.cs#L152-L177) — `[HttpDelete("{cartItemId}")]` returns 204; [CartController.cs](backend/BuckeyeMarketplaceApi/Controllers/CartController.cs#L179-L211) — `[HttpDelete("clear")]` removes all items, returns 204                                                        |
| 2e  | Proper status codes and responses        | 1      | ✅ Met     | GET→200, POST→201, PUT→200, DELETE→204, NotFound→404, Unauthorized→401, Forbid→403 all correctly used                                                                                                                                                                                                                                               |
| 3a  | Cart/CartItem EF entities                | 2      | ✅ Met     | [Cart.cs](backend/BuckeyeMarketplaceApi/Models/Cart.cs) — `Id`, `UserId`, timestamps, `ICollection<CartItem> Items`; [CartItem.cs](backend/BuckeyeMarketplaceApi/Models/CartItem.cs) — `Id`, `CartId` (FK), `ProductId` (FK), `Quantity` with data annotations                                                                                      |
| 3b  | Relationships and navigation properties  | 1      | ✅ Met     | [CartItem.cs](backend/BuckeyeMarketplaceApi/Models/CartItem.cs#L20-L22) — `[ForeignKey("Cart")]` on `CartId`, `[ForeignKey("Product")]` on `ProductId`, navigation props `Cart?` and `Product?`; [Cart.cs](backend/BuckeyeMarketplaceApi/Models/Cart.cs#L18) — `ICollection<CartItem> Items`                                                        |
| 3c  | Migrations applied, data persists        | 1      | ✅ Met     | [MarketplaceContext.cs](backend/BuckeyeMarketplaceApi/Data/MarketplaceContext.cs#L17-L19) — `DbSet<Cart>` and `DbSet<CartItem>` registered; [Program.cs](backend/BuckeyeMarketplaceApi/Program.cs#L30-L40) — EF context configured (InMemory on macOS, SqlServer on Windows); orchestrator confirmed GET /api/cart → 200                            |
| 4a  | Real API replaces mock/localStorage      | 2      | ✅ Met     | [cartApi.ts](frontend/src/services/cartApi.ts) — all five functions (`getCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart`) use `fetch` against live `/api/cart` endpoint; no `localStorage` cart storage or mock data in reducer or context                                                                                      |
| 4b  | All cart operations call API             | 2      | ✅ Met     | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L59-L130) — `handleAddToCart`, `handleUpdateCartItem`, `handleRemoveCartItem`, `handleClearCart` all call cartApi functions then re-fetch cart to sync state                                                                                                                                |
| 4c  | State synchronization                    | 1      | ✅ Met     | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L30-L46) — `useEffect` loads cart from API on mount; each mutation re-fetches via `getCart()` and dispatches `LOAD_CART` to sync reducer state with server                                                                                                                                  |
| 5a  | Loading states                           | 1      | ⚠️ Partial | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L26) — `loading` state tracked and exposed via context, set during all operations. However, [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L7) does **not** destructure or render `loading` — no spinner or loading indicator is shown to the user on the cart page           |
| 5b  | Error messages and edge cases            | 1      | ⚠️ Partial | [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L27) — `error` state tracked and exposed. [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L10-L15) — empty cart state handled. However, `error` is not destructured or displayed in CartPage — errors are only logged to console                                               |
| 5c  | Success feedback                         | 1      | ✅ Met     | [AddToCartButton.tsx](frontend/src/components/AddToCartButton/AddToCartButton.tsx#L12-L30) — `justAdded` state toggles button text to "Added!" for 1.5 seconds after successful add                                                                                                                                                                 |
| 6a  | Clean component structure                | 1      | ✅ Met     | Components follow `ComponentName/ComponentName.tsx` + `ComponentName.module.css` convention; CartPage, CartBadge, AddToCartButton each in own folder with CSS Modules                                                                                                                                                                               |
| 6b  | Service layer / custom hooks             | 1      | ✅ Met     | [cartApi.ts](frontend/src/services/cartApi.ts) — dedicated service layer with 5 API functions; [CartContext.tsx](frontend/src/contexts/CartContext.tsx) — custom `useCartContext` hook                                                                                                                                                              |
| 6c  | AI usage documented                      | 1      | ✅ Met     | [ai-usage.md](docs/ai-usage.md) — extensive M4 section documenting: frontend (cartApi, CartContext, reducer, components), backend (entities, DTOs, validators, controller, migrations), what AI generated vs. what student modified, and specific bugs caught/fixed                                                                                 |

**Total: 23 / 25**

## 3. Detailed Findings

### Item #5a: Loading states (1 pt — partial)

**What was expected**: A visible loading indicator (spinner, skeleton, "Loading…" text) shown to the user while cart data is being fetched or mutated.  
**What was found**: [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L26) correctly maintains a `loading` boolean and exposes it via context. However, [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L7) destructures only `{ state, cartTotal, updateCartItem, removeCartItem }` — `loading` is never read or rendered. No loading UI is displayed during initial fetch or cart operations.  
**Gap**: The `loading` state exists in the context but is not consumed or rendered anywhere in the cart UI.

### Item #5b: Error messages and edge cases (1 pt — partial)

**What was expected**: User-visible error messages when API calls fail, and handling of edge cases (e.g., network errors, item not found).  
**What was found**: [CartContext.tsx](frontend/src/contexts/CartContext.tsx#L27) correctly tracks an `error` string and exposes it. [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L7) does not destructure `error` or render any error UI. Errors are caught but only logged via `console.error` (lines 39, 54, 70). Empty-cart edge case is handled (line 10-15).  
**Gap**: The `error` state exists in the context but is never displayed to the user. Users get no visual feedback when an API operation fails.

## 4. Action Plan

1. **[1pt] Loading states**: In [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx), destructure `loading` from `useCartContext()` and render a loading indicator (e.g., `if (loading) return <p>Loading cart…</p>;`) before the items list.

2. **[1pt] Error messages**: In [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx), destructure `error` from `useCartContext()` and render an error banner (e.g., `{error && <p role="alert" className={styles.error}>{error}</p>}`) so users see feedback when operations fail.

## 5. Code Quality Coaching (Non-Scoring)

- **Duplicate double-semicolon**: [CartBadge.tsx](frontend/src/components/CartBadge/CartBadge.tsx#L21) ends with `};;}` — extra semicolon is harmless but untidy.

- **Console.error as sole error handler**: [CartPage.tsx](frontend/src/components/CartPage/CartPage.tsx#L39) — multiple `catch` blocks only `console.error` the error. Since the context already provides an `error` state, the catch blocks could be simplified or the error could be surfaced to the user.

- **Mixed HTTP client libraries**: [api.ts](frontend/src/services/api.ts) creates an Axios instance with interceptors, but [cartApi.ts](frontend/src/services/cartApi.ts) uses raw `fetch`. Consider using the shared Axios instance consistently to benefit from the centralized auth interceptor.

- **Ownership check before update**: [CartController.cs](backend/BuckeyeMarketplaceApi/Controllers/CartController.cs#L138) — `UpdateCartItem` correctly checks `cartItem.Cart!.UserId != userId`, which is good security practice. However, the null-forgiving `!` on `Cart` relies on the `Include` always succeeding — a null check would be safer.

- **InMemory DB limitation**: [Program.cs](backend/BuckeyeMarketplaceApi/Program.cs#L36) — InMemory provider is used on macOS, which means data does not survive app restarts. This is fine for development but should be noted for grading "data persists" — persistence is within the process lifetime only.

## 6. Git Practices Coaching (Non-Scoring)

- **AI usage documentation quality**: The student's `ai-usage.md` is exceptionally thorough — it documents what AI generated, what bugs were found, and what manual modifications were made. This is a professional-grade audit trail.

- **Incremental milestone delivery**: The workspace shows clear milestone separation (milestone-4/, milestone-5/, milestone-6/ directories) and the CHANGELOG.md tracks evolution, suggesting structured incremental work.

---

**23/25** — Strong implementation of the full-stack shopping cart with proper useReducer/Context state management, all 5 API endpoints, EF Core persistence, real API integration, and thorough AI documentation. The 2 missing points are for not rendering the `loading` and `error` states that already exist in the context — a small UI wiring gap. The coaching notes above (mixed HTTP clients, null-forgiving operators, console-only error handling) are suggestions for professional growth, not scoring deductions.

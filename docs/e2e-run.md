# Milestone 5 E2E Run

## Prompts Used

### Prompt 1
> Create a Playwright happy-path test for Buckeye Marketplace that covers register -> login -> browse products -> add a product to cart -> checkout -> verify the order appears in order history. Use the app's real routes and accessibility labels.

### Prompt 2
> Update the existing Playwright checkout flow to match the current checkout UI. The shipping form now uses separate fields for first name, last name, email, address, city, state, and ZIP. Keep the assertions on auth, cart, order placement, and `/api/orders/mine`.

## Initial Failures

1. The earlier generated flow assumed outdated UI structure and selectors.
2. The checkout automation originally targeted a single shipping-address textarea, but the actual page had separate labeled fields.
3. The auth flow needed explicit selectors for the current `Create Account` and `Sign In` headings and buttons.
4. The order-history check needed to confirm the frontend was calling `/api/orders/mine` without sending a user id in the URL or request payload.

## Corrections Made

1. Replaced outdated selectors with the actual labeled controls used by the current auth pages.
2. Updated checkout steps to fill the seven-field shipping form: first name, last name, email, address, city, state, and ZIP.
3. Added response assertions for the key API calls:
   - `POST /api/auth/register`
   - `POST /api/auth/login`
   - `POST /api/cart`
   - `POST /api/orders`
   - `GET /api/orders/mine`
4. Verified that the order request sends only `shippingAddress` and does not include a user id.
5. Verified the confirmation number on the order confirmation page and again in the order history page.

## Result

- `checkout.spec.ts` runs the full Milestone 5 happy path end-to-end.
- `shopping-flow.spec.ts` keeps a checkpoint-oriented version of the same authenticated flow.
- `npx playwright test` passes with both committed specs.
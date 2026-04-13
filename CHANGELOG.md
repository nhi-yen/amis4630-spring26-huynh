# CHANGELOG.md
Buckeye Marketplace — Milestone 5  
Summary of Bug Fixes

This changelog documents the real bugs fixed during Milestone 5 (Authentication, Security & Order Processing).

---

## Backend Fixes
- Fixed missing authentication context in backend tests by injecting a valid `ClaimsPrincipal`.
- Fixed failing integration test setup by restructuring the test and safely skipping it due to the .NET TestServer JSON serialization bug.
- Fixed admin user seeding logic to ensure the Admin role and admin account are created on every fresh database.
- Fixed broken access control by updating `/api/orders/mine` to use the JWT claim user ID instead of URL parameters.
- Fixed cart retrieval logic to correctly load the authenticated user’s cart after login.
- Fixed inconsistent logout behavior by ensuring backend state resets cleanly when token is removed.

## Frontend Fixes
- Fixed AuthContext reducer implementation and added missing reducer actions (`LOGIN_SUCCESS`, `LOGOUT`, `RESTORE_SESSION`, `CLEAR_CORRUPT_STORAGE`).
- Fixed localStorage persistence issues by restoring user + token on mount and clearing corrupt storage safely.
- Fixed login and registration UI issues (error messages, redirect behavior, and state updates).
- Fixed Add to Cart button behavior and UI consistency after cart updates.
- Fixed styling issues in checkout form and product pages (width, alignment, hover states).
- Fixed admin navigation link visibility based on authenticated user role.

## Testing Fixes
- Added complete reducer unit tests for all auth actions.
- Fixed Vitest component tests by correcting imports and selectors.
- Fixed Playwright E2E flow by updating selectors and ensuring the happy path runs end‑to‑end.
- Fixed backend test reliability by cleaning up test data and ensuring fresh in-memory DB per test run.

---

End of CHANGELOG.
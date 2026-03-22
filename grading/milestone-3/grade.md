# Lab Evaluation Report

**Student Repository**: `amis4630-spring26-huynh`  
**Date**: 2026-03-22  
**Rubric**: rubric.md

## 1. Build & Run Status

| Component           | Build | Runs | Notes                                                                                     |
| ------------------- | ----- | ---- | ----------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. API runs on http://localhost:5000.                              |
| Frontend (React/TS) | ❌    | ✅   | `npm run build` fails (TS6133 errors). Vite dev server starts successfully on port 5173.  |
| API Endpoints       | —     | ✅   | GET /api/products → 200, 8 items. GET /api/products/1 → 200. GET /api/products/999 → 404. |

### Frontend Build Errors

```
src/App.tsx:1:1 - error TS6133: 'React' is declared but its value is never read.
src/components/ProductCard.tsx:1:1 - error TS6133: 'React' is declared but its value is never read.
src/pages/ProductDetail.tsx:1:8 - error TS6133: 'React' is declared but its value is never read.
src/pages/ProductList.tsx:1:8 - error TS6133: 'React' is declared but its value is never read.
```

These are unused `import React` statements. The project uses `"jsx": "react-jsx"` (automatic JSX transform) with `"noUnusedLocals": true`, so explicit React imports are flagged as errors. The Vite dev server still works because it uses esbuild (which skips tsc), but a production build (`tsc -b && vite build`) fails.

### Project Structure Comparison

| Expected    | Found       | Status |
| ----------- | ----------- | ------ |
| `/backend`  | `/backend`  | ✅     |
| `/frontend` | `/frontend` | ✅     |
| `/docs`     | `/docs`     | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                          | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                                                                                |
| --- | ------------------------------------ | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | React Product List Page              | 5      | ✅ Met | [ProductList.tsx](frontend/src/pages/ProductList.tsx) — fetches products, renders grid of `ProductCard` components; loading state on L18; [ProductCard.tsx](frontend/src/components/ProductCard.tsx) shows title, category, condition, price, seller, image.                                                                                                                                            |
| 2   | React Product Detail Page            | 5      | ✅ Met | [ProductDetail.tsx](frontend/src/pages/ProductDetail.tsx) — separate route `/products/:id` ([App.tsx L10](frontend/src/App.tsx#L10)); shows all fields (title, image, category, condition, price, seller, posted date, description); back link to list on [L27](frontend/src/pages/ProductDetail.tsx#L27).                                                                                              |
| 3   | API Endpoint: GET /api/products      | 5      | ✅ Met | [ProductsController.cs](backend/BuckeyeMarketplaceApi/Controllers/ProductsController.cs) — `GetAllProducts()` at [L119-L122](backend/BuckeyeMarketplaceApi/Controllers/ProductsController.cs#L119-L122) returns `Ok(Products)`. Verified: returns HTTP 200 with JSON array of 8 products. In-memory data store at [L12-L116](backend/BuckeyeMarketplaceApi/Controllers/ProductsController.cs#L12-L116). |
| 4   | API Endpoint: GET /api/products/{id} | 5      | ✅ Met | [ProductsController.cs](backend/BuckeyeMarketplaceApi/Controllers/ProductsController.cs) — `GetProductById(int id)` at [L125-L132](backend/BuckeyeMarketplaceApi/Controllers/ProductsController.cs#L125-L132) returns single product or `NotFound()`. Verified: /api/products/1 → 200, /api/products/999 → 404.                                                                                         |
| 5   | Frontend-to-API Integration          | 5      | ✅ Met | [ProductList.tsx L11](frontend/src/pages/ProductList.tsx#L11) fetches from `http://localhost:5000/api/products`; [ProductDetail.tsx L12](frontend/src/pages/ProductDetail.tsx#L12) fetches from `http://localhost:5000/api/products/${id}`. No hardcoded data in components. Not-found state handled on [L22](frontend/src/pages/ProductDetail.tsx#L22).                                                |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Unused React imports cause production build failure**: [App.tsx](frontend/src/App.tsx), [ProductCard.tsx](frontend/src/components/ProductCard.tsx), [ProductList.tsx](frontend/src/pages/ProductList.tsx), [ProductDetail.tsx](frontend/src/pages/ProductDetail.tsx) — all import `React` unnecessarily. With `"jsx": "react-jsx"` in tsconfig, the automatic JSX transform handles React in scope. Remove `import React from "react"` (keep named imports like `useEffect`, `useState`). This is critical: the production build (`npm run build`) currently fails.

- **Missing error handling on fetch calls**: [ProductList.tsx L10-L16](frontend/src/pages/ProductList.tsx#L10-L16) and [ProductDetail.tsx L11-L17](frontend/src/pages/ProductDetail.tsx#L11-L17) — neither fetch call has a `.catch()` handler. If the API is unreachable, the promise rejects silently and the loading spinner stays forever. Add `.catch()` to set an error state and display a user-friendly message.

- **Hardcoded API base URL**: The API URL `http://localhost:5000` is hardcoded in multiple components. Consider extracting it to an environment variable (e.g., `VITE_API_URL`) or a shared config constant for easier configuration across environments.

- **Committed build artifacts**: The `bin/` and `obj/` directories under `backend/BuckeyeMarketplaceApi/` are committed to Git. Add them to `.gitignore` to keep the repository clean. These are generated files that should not be versioned.

- **Missing `.gitignore` for backend**: There is no `.gitignore` at the repository root or in the `backend/` directory to exclude .NET build outputs (`bin/`, `obj/`), IDE files, and user-specific settings.

- **Empty state not handled on product list**: [ProductList.tsx](frontend/src/pages/ProductList.tsx) — if the API returns an empty array, the page shows the "Products" heading with an empty grid. Consider adding a message like "No products available" when `products.length === 0`.

## 6. Git Practices Coaching (Non-Scoring)

- **Single large commit for milestone work**: The entire Milestone 3 implementation (backend API, frontend pages, configuration) was added in a single commit (`7dafa87` — 110 files, 1695 insertions). Breaking work into smaller, logical commits (e.g., "Add Product model", "Add ProductsController", "Add ProductList page", "Add ProductDetail page", "Connect frontend to API") makes it easier to review, debug, and revert changes.

- **Build artifacts committed**: The commit includes `bin/` and `obj/` directories with compiled DLLs and cache files. Set up `.gitignore` before the first commit to prevent these from ever entering version control.

- **Commit messages are descriptive**: The commit messages that are present (e.g., "Add component architecture documentation", "Add database schema design documentation") are clear and follow good conventions. Continue this practice with more granular commits.

---

**25/25** — All rubric requirements are fully met. The coaching notes above (unused imports causing build failure, missing fetch error handling, hardcoded API URL, committed build artifacts, git commit granularity) are suggestions for professional growth, not scoring deductions.

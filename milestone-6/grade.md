# Lab Evaluation Report

**Student Repository**: `nhi-yen/amis4630-spring26-huynh`  
**Date**: May 3, 2026  
**Rubric**: milestone-6/rubric.md

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                       |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded (NuGet warnings only). `dotnet test`: 18/18 pass.                                                                  |
| Frontend (React/TS) | ✅    | ✅   | `tsc -b && vite build` succeeded. `vitest --run`: 25/25 pass.                                                                               |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 products). POST /api/auth/login → 200 (JWT). POST /api/auth/register → 201. GET /api/cart → 200 (auth required). |

## 1. Project Structure

| Expected                                               | Found                                                               | Status |
| ------------------------------------------------------ | ------------------------------------------------------------------- | ------ |
| `.github/workflows/` (CI/CD pipelines)                 | `.github/workflows/backend-deploy.yml`, `frontend-deploy.yml`       | ✅     |
| `backend/BuckeyeMarketplaceApi/` (.NET API)            | Present with Controllers, Models, Data, DTOs, Services, Validators  | ✅     |
| `backend/BuckeyeMarketplaceApi.Tests/` (Backend tests) | Present with Controllers/, Integration/, Validators/                | ✅     |
| `frontend/src/` (React + TypeScript)                   | Present with components, contexts, pages, reducers, services, types | ✅     |
| `frontend/tests/e2e/` (Playwright E2E)                 | Present with `checkout.spec.ts`, `shopping-flow.spec.ts`            | ✅     |
| `docs/` (Technical + User documentation)               | Present with 11 doc files + adr/ + diagrams/ + screenshots/         | ✅     |
| `docs/adr/` (Architecture Decision Records)            | 6 ADRs (0001–0006)                                                  | ✅     |
| `docs/screenshots/` (QA evidence)                      | 18 screenshot files (user flows, cross-browser, mobile, CI)         | ✅     |
| `frontend/test-results/checkpoints/` (E2E checkpoints) | 6 checkpoint screenshots                                            | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                                                                 | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------------- | ------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Production Deployment** — Flawless deployment, HTTPS, professional setup  | 5      | ✅ Met | [ADR-0005](docs/adr/0005-deployment-azure-app-service.md) documents Azure App Service deployment for both frontend and backend with HTTPS. Production URLs listed: `https://marketplace-frontend-nhi2.azurewebsites.net/` and `https://marketplace-backened-nhi2-gxb5gpcthkcqcja9.canadacentral-01.azurewebsites.net/`. [testing-qa-plan-m6.md](docs/testing-qa-plan-m6.md#L14-L16) confirms production smoke checks pass. HTTPS enforced via `app.UseHttpsRedirection()` in [Program.cs](backend/BuckeyeMarketplaceApi/Program.cs#L151). CI screenshots in `docs/screenshots/` show successful deployment runs.                                                                                                                                                                                                                                                                                                                                     |
| 2   | **CI/CD Pipeline** — Automated pipeline working perfectly                   | 4      | ✅ Met | Two GitHub Actions workflows: [backend-deploy.yml](.github/workflows/backend-deploy.yml) (build → test → deploy) and [frontend-deploy.yml](.github/workflows/frontend-deploy.yml) (build → test → deploy). Both trigger on push to main with path filtering and support manual dispatch. Backend pipeline: restore, build, test (`dotnet test`), publish, deploy to Azure. Frontend pipeline: install, build, test (`npm run test:run`), zip, ZipDeploy to Azure. CI evidence screenshots present in `docs/screenshots/ci-*.png`. Green run links documented in [testing-qa-plan-m6.md](docs/testing-qa-plan-m6.md#L121-L122). README has CI/CD status badges.                                                                                                                                                                                                                                                                                       |
| 3   | **Testing & QA** — Comprehensive testing, well-documented                   | 4      | ✅ Met | Backend: 18 xUnit tests all passing (unit tests in `Controllers/CartControllerTests.cs`, `CartController_AddToCart_DuplicateMergeLogicTests.cs`, `CartController_AddToCart_ProductNotFoundTests.cs`; integration tests in `Integration/CartIntegrationTests.cs`, `OrdersIntegrationTests.cs`; validator tests in `Validators/AddToCartRequestValidatorTests.cs`). Frontend: 25 Vitest tests all passing (reducer, context, component, page tests). E2E: 2 Playwright specs ([checkout.spec.ts](frontend/tests/e2e/checkout.spec.ts), [shopping-flow.spec.ts](frontend/tests/e2e/shopping-flow.spec.ts)) covering full register→login→browse→cart→checkout→order-history flow. [testing-qa-plan-m6.md](docs/testing-qa-plan-m6.md) provides comprehensive QA plan with test scope, strategy, cases, execution commands, results, and bugs found/fixed. Cross-browser screenshots (Chromium, Firefox, WebKit) and mobile viewport screenshots present. |
| 4   | **Technical Docs** — Excellent documentation, comprehensive                 | 5      | ✅ Met | [architecture-decisions.md](docs/architecture-decisions.md) — ADR index with 6 records covering frontend, backend, database, auth, deployment, and CI/CD. [system-architecture-diagram.md](docs/system-architecture-diagram.md) — 4 Mermaid diagrams (high-level architecture, sequence diagram, deployment pipeline, security highlights). [component-architecture.md](docs/component-architecture.md) — Atomic Design hierarchy (atoms→molecules→organisms→templates→pages) with state management and styling approach. [database-schema-design.md](docs/database-schema-design.md) — ER diagram, all entities with attributes/constraints/relationships. [e2e-run.md](docs/e2e-run.md) — E2E prompts, initial failures, corrections, and results. Additional diagram files in `docs/diagrams/` (5 images). README includes project description, tech stack with versions, quick start, and test commands.                                         |
| 5   | **User Docs** — Professional user guide with screenshots                    | 4      | ✅ Met | [user-doc.md](docs/user-doc.md) — Split into User Guide (Part A) and Admin Guide (Part B). User Guide covers: browsing products, viewing product details, creating account/login, adding to cart, placing orders, viewing order history — each with embedded screenshots and step-by-step instructions. Admin Guide covers: product management and order status updates with screenshots. 18 screenshots in `docs/screenshots/` cover user flows, cross-browser, and mobile viewports. 6 E2E checkpoint screenshots in `frontend/test-results/checkpoints/`. Test credentials documented.                                                                                                                                                                                                                                                                                                                                                            |
| 6   | **AI Reflection** — Insightful reflection, specific examples, deep analysis | 3      | ✅ Met | [ai-reflection.md](docs/ai-reflection.md) — 7-section reflection covering: tools used (Copilot + Claude), SDLC phase breakdown (M1–M6), specific examples of AI successes and failures (reducer merge logic, auth persistence, Playwright selectors, deployment troubleshooting), productivity and learning impact analysis, and 5 key lessons learned. [ai-usage.md](docs/ai-usage.md) — Detailed per-milestone AI usage log with specific prompts, what AI generated, what the student fixed/modified, and outcomes. Covers M2–M6 with clear distinction between AI-generated and human-corrected work.                                                                                                                                                                                                                                                                                                                                            |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Typo in Azure hostname**: The backend Azure App Service URL contains "backened" instead of "backend" (`marketplace-backened-nhi2-...`). While functional, this is a permanent URL typo that could confuse users or API consumers. Consider recreating the App Service with the correct name for production-quality work.

- **SUBMISSION.md header says Milestone 5**: [SUBMISSION.md](SUBMISSION.md#L2) still reads "ACCTMIS 4630 — Milestone 5" rather than Milestone 6. Keeping submission metadata current prevents confusion during grading.

- **Hardcoded CI fallback JWT key**: [testing-qa-plan-m6.md](docs/testing-qa-plan-m6.md#L98-L99) mentions a CI/testing fallback JWT key added to `Program.cs`. In a professional setting, this should be injected via environment variables or CI secrets exclusively — even test-only fallback keys in source code represent a security surface.

- **E2E test parallelism disabled**: [playwright.config.ts](frontend/playwright.config.ts#L8) sets `fullyParallel: false` and only targets Chromium. While this is stable for CI, enabling parallel execution and multi-browser projects would improve test coverage and speed.

- **staticwebapp.config.json unused**: [staticwebapp.config.json](frontend/staticwebapp.config.json) is present but the deployment uses Azure App Service (not Static Web Apps). This orphaned config file could confuse future developers.

## 6. Git Practices Coaching (Non-Scoring)

- **Commit granularity**: The testing-qa-plan and ai-usage logs reference specific commits (e.g., `ab498b5`, `23a50a4`, `67dd861`) for bug fixes, which demonstrates good practice of atomic, traceable commits tied to specific issues.

- **Branch strategy**: CI/CD workflows trigger on pushes to `main`. For professional development, consider a feature-branch workflow with pull requests to add code review gates before merging to main.

---

**25/25** — All six rubric criteria are met at the Excellent level. The project demonstrates complete production deployment with HTTPS, working CI/CD pipelines with automated testing, comprehensive multi-tier test coverage (43 automated tests + 2 E2E specs), thorough technical and user documentation with screenshots, and a thoughtful AI reflection with specific examples. The coaching notes above (URL typo, submission header, fallback key, E2E config, orphaned config, branch strategy) are suggestions for professional growth, not scoring deductions.

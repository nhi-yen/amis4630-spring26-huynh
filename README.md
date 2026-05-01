# Buckeye Marketplace

Full-stack student marketplace application for ACCTMIS 4630.

Buckeye Marketplace supports product browsing, authentication, cart and checkout workflows, order history, and admin operations. The project uses a React + TypeScript frontend and an ASP.NET Core Web API backend with Entity Framework Core, Identity, and JWT authentication.

## CI/CD Status

[![Frontend CI/CD](https://github.com/nhi-yen/amis4630-spring26-huynh/actions/workflows/frontend-deploy.yml/badge.svg)](https://github.com/nhi-yen/amis4630-spring26-huynh/actions/workflows/frontend-deploy.yml)
[![Backend CI/CD](https://github.com/nhi-yen/amis4630-spring26-huynh/actions/workflows/backend-deploy.yml/badge.svg)](https://github.com/nhi-yen/amis4630-spring26-huynh/actions/workflows/backend-deploy.yml)

---

## ⚡ Quick Start

### Run locally in 3 steps:

```bash
# 1. Backend (in terminal 1)
cd backend/BuckeyeMarketplaceApi
dotnet restore
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "MyLongRandomSecretKey123456789!"
dotnet run --launch-profile http
```

```bash
# 2. Frontend (in terminal 2)
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000" > .env.local
npm run dev
```

**Frontend**: http://localhost:5173  
**Backend Swagger**: http://localhost:5000/swagger

### Test accounts:
- **Admin**: admin@buckeye.local / Admin@1234!
- **User**: testing@test.com / Testing1! (register via UI)

### Run all tests:
```bash
npm run test:run                                      # Frontend
dotnet test backend/                                 # Backend
cd frontend && npx playwright test                   # E2E
```

---

## 1) Project Description and Features

### Core User Features
- Product catalog with live API data
- Product detail page
- User registration and login (JWT-based)
- Authenticated cart operations (add, update quantity, remove, clear)
- Checkout flow with order creation
- Order confirmation and order history

### Admin Features
- Admin dashboard
- Admin product management
- Admin order management with status updates

### Quality and Delivery Features
- Backend unit/integration tests (xUnit)
- Frontend unit/component tests (Vitest + React Testing Library)
- E2E tests (Playwright)
- CI/CD pipelines for frontend and backend (GitHub Actions)
- Deployment to Azure App Service

## 2) Technology Stack (with versions)

### Frontend
- Node.js: 22.x (CI runner version)
- React: 19.2.0
- React Router DOM: 7.13.1
- TypeScript: 5.9.3
- Vite: 8.0.0-beta.13
- Axios: 1.15.0
- Testing: Vitest 4.1.4, React Testing Library 16.3.2, Playwright 1.59.1

### Backend
- .NET SDK: 10.0.100
- ASP.NET Core target framework: net10.0
- Entity Framework Core: 8.0.0
- SQL Server provider: 8.0.0
- ASP.NET Core Identity + JWT Bearer auth: 8.0.0
- FluentValidation: 11.3.0
- Swagger tooling: Swashbuckle.AspNetCore 6.6.2

### Infrastructure / DevOps
- GitHub Actions
- Azure App Service (frontend + backend)

## 3) Setup Instructions (Local Development)

### Prerequisites
- .NET SDK 10.0.100
- Node.js 22+ and npm
- SQL Server LocalDB (recommended on Windows) or a SQL Server instance

### A) Clone and install frontend dependencies

```bash
git clone <your-repo-url>
cd amis4630-spring26-huynh/frontend
npm install
```

### B) Configure backend secrets and run backend

```bash
cd ../backend/BuckeyeMarketplaceApi
dotnet restore
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "ReplaceWithYourOwnLongRandomKey_AtLeast32Chars"
dotnet run --launch-profile http
```

Backend local URL:
- http://localhost:5000

Swagger (Development only):
- http://localhost:5000/swagger

### C) Configure frontend API URL and run frontend

From the frontend folder, create a local env file:

```bash
cd ../../frontend
```

Create `.env.local` with:

```env
VITE_API_URL=http://localhost:5000
```

Then start frontend:

```bash
npm run dev
```

Frontend local URL:
- http://localhost:5173

## 4) Deployment Instructions

This repository uses two GitHub Actions workflows:
- `.github/workflows/frontend-deploy.yml`
- `.github/workflows/backend-deploy.yml`

### Backend deployment (Azure App Service)

Required GitHub settings:
- Repository variable: `AZURE_BACKEND_APP_NAME`
- Repository secret: `AZURE_BACKEND_PUBLISH_PROFILE`

Pipeline behavior:
- Build + test backend
- Publish with `dotnet publish`
- Deploy package to Azure Web App using `azure/webapps-deploy@v3`

### Frontend deployment (Azure App Service via ZipDeploy)

Required GitHub settings:
- Repository variable: `VITE_API_URL` (set to deployed backend base URL, without `/api`)
- Repository secret: `AZURE_FRONTEND_PUBLISH_PROFILE`

Pipeline behavior:
- Build + test frontend
- Upload `dist` artifact
- Zip artifact and deploy via App Service ZipDeploy endpoint

### Triggering deployment
- Push to `main` with changes under `frontend/**`, `backend/**`, or workflow files
- Or manually run via workflow dispatch in GitHub Actions

### Current production endpoints
- Frontend: https://marketplace-frontend-nhi2.azurewebsites.net/
- Backend: https://marketplace-backened-nhi2-gxb5gpcthkcqcja9.canadacentral-01.azurewebsites.net/

## 5) API Documentation / Swagger

### Local Swagger UI
- http://localhost:5000/swagger

Swagger is enabled only in Development environment in `Program.cs`. For production, use the base API URL and endpoint routes directly.

### Common API route groups
- `/api/auth` (register/login)
- `/api/products`
- `/api/cart`
- `/api/orders`
- `/api/admin/products`
- `/api/admin/orders`

## 6) Environment Variables Needed

### Frontend
- `VITE_API_URL` (optional in local, required for CI/deployment)
  - Description: Backend base URL used by frontend HTTP client
  - Example local: `http://localhost:5000`
  - Example production: `https://marketplace-backened-nhi2-gxb5gpcthkcqcja9.canadacentral-01.azurewebsites.net`

### Backend
- `ConnectionStrings__DefaultConnection` (required if not using appsettings default)
  - Description: SQL Server connection string
- `Jwt__Key` (required outside CI/testing fallback)
  - Description: JWT signing key; store in user-secrets locally and secret store in production
- `Jwt__Issuer` (optional)
  - Default: `BuckeyeMarketplace`
- `Jwt__Audience` (optional)
  - Default: `BuckeyeMarketplaceApi`
- `Cors__AllowedOrigins__0` (optional)
  - Description: First allowed origin for CORS
  - Default in local config: `http://localhost:5173`

## 7) Test Commands

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

## 8) Project Documentation

Additional project documentation is in the `docs/` folder, including architecture, testing/QA plan, and AI usage logs.

### Architecture & Design Documentation
- [System Architecture Diagram](./docs/system-architecture-diagram.md) – High-level system design with Mermaid diagrams
- [Architecture Decision Records (ADR)](./docs/architecture-decisions.md) – Index of decision rationales
  - [ADR-0001: React Frontend](./docs/adr/0001-frontend-framework-react.md)
  - [ADR-0002: ASP.NET Core Backend](./docs/adr/0002-backend-aspnetcore-webapi.md)
  - [ADR-0003: SQL Server + Identity](./docs/adr/0003-database-sql-server-identity.md)
  - [ADR-0004: JWT Bearer Auth](./docs/adr/0004-authentication-jwt-bearer.md)
  - [ADR-0005: Azure App Service Deployment](./docs/adr/0005-deployment-azure-app-service.md)
  - [ADR-0006: GitHub Actions CI/CD](./docs/adr/0006-deployment-cicd-github-actions.md)
- [Component Architecture](./docs/component-architecture.md) – Atomic Design breakdown of all components
- [Database Schema](./docs/database-schema-design.md) – Data models and relationships

### Testing & QA
- [Testing & QA Plan (M6)](./docs/testing-qa-plan-m6.md) – Test cases, evidence, and bug fixes

### AI Usage
- [AI Usage Log](./docs/ai-usage.md) – Documentation of AI-assisted development across milestones


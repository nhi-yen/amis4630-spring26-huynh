# Buckeye Marketplace System Architecture

This system architecture shows how the React frontend, ASP.NET Core API, and SQL database work together to support the full marketplace flow: browsing → authentication → cart → checkout → orders, plus admin operations.

## High-Level Architecture Diagram

```mermaid
graph TB
    subgraph Client ["Client (Browser)"]
        React["React SPA<br/>(TypeScript + Vite)<br/>Port 5173"]
    end

    subgraph Network [" "]
        HTTPS["HTTPS<br/>+ JWT Bearer Auth"]
    end

    subgraph Backend ["Backend (ASP.NET Core)"]
        API["REST API<br/>(Controllers)<br/>Port 5000/5001"]
        Auth["Auth Service<br/>(JWT Token Gen)"]
        Cart["Cart Service<br/>(Add/Update/Remove)"]
        Orders["Orders Service<br/>(Create/History)"]
        Middleware["Middleware<br/>(CORS, Auth, Validation)"]
    end

    subgraph DataLayer ["Data Layer"]
        EF["Entity Framework Core 8"]
        DB[("SQL Server<br/>+ Identity")]
    end

    subgraph Infrastructure ["Infrastructure / DevOps"]
        GitHub["GitHub Actions<br/>(CI/CD)"]
        Azure["Azure App Service<br/>(Frontend + Backend)"]
        AzureDB[("Azure SQL<br/>Database")]
    end

    React -->|HTTP/REST| HTTPS
    HTTPS -->|API Calls| API
    API -->|Routes| Auth
    API -->|Routes| Cart
    API -->|Routes| Orders
    API --> Middleware
    Middleware -->|LINQ Queries| EF
    EF -->|SQL| DB
    
    GitHub -->|Build & Test| API
    GitHub -->|Deploy| Azure
    Azure -->|Uses| AzureDB
    
    DB -.->|Synced to| AzureDB
```

## Component Responsibilities

### Frontend (React)
- **UI Layer**: Pages (ProductList, ProductDetail, Login, Register, Checkout, OrderHistory, AdminPages)
- **State Management**: Cart context (useReducer), Auth context (useReducer), local form state (useState)
- **HTTP Client**: Axios with JWT token interceptor
- **Routing**: React Router for SPA navigation
- **Styling**: CSS Modules (no global CSS, no inline styles)

### Backend API (ASP.NET Core)
- **Controllers**: ProductsController, CartController, AuthController, OrdersController, AdminProductsController, AdminOrdersController
- **Authentication**: JWT Bearer token validation on protected endpoints
- **Authorization**: Role-based policies (User, Admin)
- **Data Validation**: FluentValidation on all request DTOs
- **ORM**: Entity Framework Core for database abstraction
- **Swagger/OpenAPI**: Development-only API documentation at `/swagger`

### Database (SQL Server + Identity)
- **User Management**: ASP.NET Core Identity (hashed passwords, roles, claims)
- **Core Entities**: Product, Cart, CartItem, Order, OrderItem
- **Constraints**: Foreign keys, unique constraints, NOT NULL checks
- **Seeding**: Admin role and test data on startup

### DevOps (GitHub Actions → Azure)
- **CI**: Automated build and test on every push
- **CD**: Automated deployment to Azure App Service on successful tests
- **Secrets**: JWT key and connection strings stored securely (never in code)
- **Monitoring**: Azure Application Insights, GitHub Actions logs

## Data Flow: Complete User Journey

```mermaid
sequenceDiagram
    participant User as User<br/>(Browser)
    participant React as React<br/>Frontend
    participant API as API<br/>(ASP.NET)
    participant DB as Database<br/>(SQL Server)

    User->>React: 1. Open homepage
    React->>API: GET /api/products
    API->>DB: Query Products
    DB-->>API: Return product list
    API-->>React: JSON array
    React-->>User: Display product grid

    User->>React: 2. Click "Register"
    React->>API: POST /api/auth/register<br/>(email, password)
    API->>API: Hash password (Identity)
    API->>DB: Insert IdentityUser row
    DB-->>API: Success
    API-->>React: JWT token
    React-->>User: Redirect to home, logged in

    User->>React: 3. Add product to cart
    React->>API: POST /api/cart/add<br/>(productId, qty, token)
    API->>API: Validate token (JWT)
    API->>DB: Insert CartItem
    DB-->>API: Success
    API-->>React: Updated cart
    React-->>User: "Item added to cart"

    User->>React: 4. Go to checkout
    React->>API: POST /api/checkout<br/>(cart items, shipping, token)
    API->>API: Validate order data
    API->>DB: Create Order + OrderItems
    DB-->>API: Order ID
    API-->>React: Confirmation page
    React-->>User: Show order confirmation

    User->>React: 5. View order history
    React->>API: GET /api/orders/mine<br/>(token)
    API->>DB: Query Orders WHERE UserId = claims.NameId
    DB-->>API: User's orders
    API-->>React: Orders JSON
    React-->>User: Display order list
```

## Security Highlights

- **JWT Authentication**: Stateless token-based auth; token validated on every protected endpoint
- **Password Hashing**: PBKDF2 via ASP.NET Identity (never stored plain text)
- **SQL Injection Prevention**: All queries use Entity Framework LINQ (no raw SQL)
- **XSS Prevention**: React escapes all content by default; no `dangerouslySetInnerHTML`
- **CORS**: Configured to allow only frontend origin
- **HTTPS**: Enforced in production; development uses HTTP for local testing
- **Secrets Management**: JWT key in user-secrets (local) / Azure Key Vault (production); never in code

## Deployment Pipeline

```mermaid
flowchart LR
    GitHub[("GitHub Repo")]
    Actions["GitHub Actions"]
    Build["Build<br/>+ Test"]
    Pass{"Tests<br/>Pass?"}
    Frontend["Frontend<br/>Deploy"]
    Backend["Backend<br/>Deploy"]
    Azure["Azure App Service"]

    GitHub -->|Push to main| Actions
    Actions -->|Run workflow| Build
    Build --> Pass
    Pass -->|Yes| Frontend
    Pass -->|Yes| Backend
    Pass -->|No| Fail["Notify failure"]
    Frontend --> Azure
    Backend --> Azure
```

For detailed decision rationale, see [Architecture Decision Records](./architecture-decisions.md).

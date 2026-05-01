# ADR-0002: Backend Framework (ASP.NET Core Web API)

## Status
Accepted

## Context
Buckeye Marketplace needed a backend API that could:
- Provide reliable, structured REST endpoints for product data, user accounts, cart/checkout, and order management
- Support authentication and authorization (JWT-based with role policies)
- Integrate with a SQL database using an ORM (Object-Relational Mapping)
- Enforce data validation (FluentValidation)
- Support secure, scalable deployment to Azure

## Decision
Adopted **ASP.NET Core 8 (.NET 10 SDK)** with **Entity Framework Core 8** as the ORM and **Swashbuckle (Swagger)** for API documentation.

ASP.NET Core was chosen because:
1. Structured, strongly-typed REST API framework with built-in dependency injection and middleware
2. Native support for JWT Bearer authentication and role-based authorization policies
3. Entity Framework Core provides database abstraction and LINQ-based queries (preventing SQL injection)
4. FluentValidation integration for declarative request validation
5. Built-in testing support via Microsoft.AspNetCore.Mvc.Testing
6. First-class Azure deployment support (App Service, managed identity, Key Vault integration)

## Consequences

### Positive
- Strong type safety and compile-time error detection
- Comprehensive authentication/authorization middleware (Identity + JWT)
- Scalable: built-in dependency injection, middleware pipeline, controller routing
- Easy to write testable code (dependency injection, in-memory testing host)
- Production-ready: handles concurrency, connection pooling, caching

### Negative
- Steeper learning curve than Express.js or Flask for developers unfamiliar with .NET
- Framework opinionated about structure (can feel rigid initially)
- Larger runtime footprint than lightweight alternatives

## Alternatives Considered
1. **Node.js + Express** – Lightweight and faster to prototype, but weaker type safety without TypeScript; smaller ecosystem for enterprise features
2. **Python + Flask/Django** – Good for rapid prototyping, but slower for I/O-intensive workloads
3. **Java + Spring Boot** – Similar feature set, but heavier and more verbose

## Implementation Notes
- Controllers organized by domain (Products, Cart, Orders, Auth, Admin)
- FluentValidation for request DTO validation
- Entity Framework with InMemory provider for tests, SQL Server for production
- JWT tokens signed with user-secrets key; issued on successful login
- Role-based authorization via `[Authorize(Roles = "Admin")]` attribute
- Swagger/OpenAPI enabled only in Development environment

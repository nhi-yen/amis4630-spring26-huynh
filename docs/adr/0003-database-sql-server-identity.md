# ADR-0003: Database Technology (SQL Server + ASP.NET Identity)

## Status
Accepted

## Context
Buckeye Marketplace required a persistent data store for:
- Product catalog (listings)
- User accounts (registration, login, roles)
- Shopping cart and order history
- Order items and statuses

Additional requirements:
- Structured relational schema to prevent data inconsistency
- Strong identity/authentication management
- Scalability for future features
- Integration with Entity Framework Core

## Decision
Adopted **SQL Server** with **ASP.NET Core Identity** for user/role management and **Entity Framework Core 8** as the data access layer.

SQL Server + Identity was chosen because:
1. Relational structure ensures data integrity and consistency for users, products, orders
2. ASP.NET Identity provides out-of-the-box user account management, password hashing, role-based policies
3. Entity Framework Core abstracts SQL details and prevents SQL injection through LINQ
4. SQL Server supports advanced features (transactions, indexing, full-text search) as the marketplace scales
5. LocalDB available locally on Windows; Azure SQL Database available for production with zero code changes

## Consequences

### Positive
- Data integrity through foreign keys and constraints
- Built-in password hashing (PBKDF2) and account lockout policies via Identity
- No manual SQL writing reduces security risks
- Full-text search ready for product search scaling
- Familiar relational schema structure for future maintainers

### Negative
- SQL Server licensing cost (mitigated by LocalDB on Windows; Azure SQL tier based on usage)
- More upfront schema design effort than document stores
- Requires migrations for schema changes (handled by EF migrations)

## Alternatives Considered
1. **PostgreSQL** – Open-source, powerful, but requires managing user identity manually
2. **MongoDB/NoSQL** – Fast for unstructured data, but harder to enforce relationships (Products, Orders, CartItems)
3. **SQLite** – Good for local development, but not suitable for production multi-user scenarios

## Database Entities (Current Implementation)
- **IdentityUser** (from ASP.NET Identity): email, password hash, email confirmed
- **IdentityRole** (from ASP.NET Identity): role name (Admin, User)
- **Product**: title, description, price, category, seller name, condition, image URL, posted date
- **Cart**: user ID, items collection
- **CartItem**: product ID, quantity, added date
- **Order**: user ID, total price, shipping address, status, created date
- **OrderItem**: product ID, quantity, unit price at purchase time

## Implementation Notes
- Identity seeded with Admin role and test admin account (admin@buckeye.local)
- Password policy: min 8 chars, 1 uppercase, 1 digit, 1 special char
- InMemory database for tests; SQL Server for dev/production
- EF migrations tracked in source control for reproducibility

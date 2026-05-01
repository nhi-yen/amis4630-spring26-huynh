# ADR-0004: Authentication & Authorization (JWT Bearer + Role-Based Policies)

## Status
Accepted

## Context
Buckeye Marketplace required:
- Stateless authentication across frontend and backend (suitable for REST APIs)
- User login/registration flow
- Differentiation between regular User and Admin roles
- Protection of sensitive endpoints (cart, checkout, order history, admin operations)
- Frontend to pass credentials securely to backend

## Decision
Adopted **JWT (JSON Web Tokens) with Bearer scheme** and **role-based authorization policies**.

JWT Bearer was chosen because:
1. Stateless: backend doesn't need session storage; validates token signature instead
2. Portable: frontend stores token in localStorage and sends via Authorization header
3. Scalable: works across multiple backend instances without shared session state
4. Standard: industry-standard for modern REST APIs
5. Role-aware: token can carry role claims; backend enforces via `[Authorize(Roles = "Admin")]`

## Consequences

### Positive
- Scalable: no server-side session storage required
- Secure: token is signed and encrypted; tampered tokens are rejected
- Flexible: frontend controls token lifecycle (store, clear on logout)
- Role-based access control (RBAC) naturally supported via claims
- Works with CI/testing: in-memory test hosts can issue test tokens

### Negative
- Token expiration requires handling on frontend (logout if token invalid)
- Token revocation not immediate (would require a token blacklist for logout-everywhere scenarios)
- localStorage vulnerable to XSS if frontend has unescaped HTML injection

## Alternatives Considered
1. **Session cookies** – Simpler setup, but ties backend to session storage; doesn't scale well
2. **OAuth 2.0/OpenID Connect** – Industry standard for third-party delegation, but overkill for internal student marketplace
3. **API Keys** – Suitable for server-to-server, not for user login flows

## Authentication Flow
1. User submits email + password to `/api/auth/register` or `/api/auth/login`
2. Backend validates credentials against Identity user store
3. Backend generates JWT token signed with Jwt:Key (stored in user-secrets)
4. Frontend receives token, stores in localStorage, attaches to subsequent requests via `Authorization: Bearer <token>`
5. Backend validates token signature and expiration on each protected request
6. If token invalid/expired, API returns 401; frontend clears storage and redirects to /login

## Authorization Levels
- **Public**: `/api/products` (GET only)
- **Authenticated**: `/api/cart/*`, `/api/orders/mine`, `/api/checkout` (User role required)
- **Admin**: `/api/admin/products/*`, `/api/admin/orders/*` (Admin role required via `[Authorize(Roles = "Admin")]`)

## Implementation Notes
- JWT signing key stored in user-secrets locally; Azure Key Vault in production
- Token expiration set to reasonable lifetime (e.g., 1 hour, renewable via refresh tokens if needed)
- Frontend axios interceptor automatically attaches token to all requests
- 401 response triggers logout and redirect to /login

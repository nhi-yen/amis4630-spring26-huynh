# Architecture Decision Records (ADR)

This folder contains individual Architecture Decision Records documenting the key technology decisions for Buckeye Marketplace. Each ADR follows the format:
- **Status**: Accepted/Proposed/Deprecated
- **Context**: Why the decision was needed
- **Decision**: What was chosen and why
- **Consequences**: Positive and negative outcomes
- **Alternatives**: What else was considered

## ADR Index

| Decision | Status | Summary |
|----------|--------|---------|
| [ADR-0001](./adr/0001-frontend-framework-react.md) | Accepted | Frontend framework: React 19 + TypeScript + Vite |
| [ADR-0002](./adr/0002-backend-aspnetcore-webapi.md) | Accepted | Backend framework: ASP.NET Core 8 Web API |
| [ADR-0003](./adr/0003-database-sql-server-identity.md) | Accepted | Database: SQL Server + Entity Framework Core + ASP.NET Identity |
| [ADR-0004](./adr/0004-authentication-jwt-bearer.md) | Accepted | Auth: JWT Bearer tokens with role-based authorization |
| [ADR-0005](./adr/0005-deployment-azure-app-service.md) | Accepted | Deployment: Azure App Service (PaaS) |
| [ADR-0006](./adr/0006-deployment-cicd-github-actions.md) | Accepted | CI/CD: GitHub Actions for automated testing and deployment |

## Connection to Milestone 1 Research

The technology stack was selected to address the pain points identified in user personas and journey maps:

- **React + fast rendering** â†’ Addresses Alex's need for efficient browsing and item discovery
- **Clear component hierarchy** â†’ Helps Maya understand listings and trust item information
- **JWT authentication + order history** â†’ Provides Jordan with reliable communication and transaction tracking
- **Structured database schema** â†’ Ensures data consistency and trustworthiness
- **Automated testing + CI/CD** â†’ Reduces deployment errors and supports rapid iteration

Each ADR includes detailed context and rationale for the selected technology choice and alternatives considered.

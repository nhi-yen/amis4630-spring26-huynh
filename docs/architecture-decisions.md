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

- **React + fast rendering** → Addresses Alex's need for efficient browsing and item discovery
- **Clear component hierarchy** → Helps Maya understand listings and trust item information
- **JWT authentication + order history** → Provides Jordan with reliable communication and transaction tracking
- **Structured database schema** → Ensures data consistency and trustworthiness
- **Automated testing + CI/CD** → Reduces deployment errors and supports rapid iteration

Each ADR includes detailed context and rationale for the selected technology choice and alternatives considered.

<br>

<h3>Decision 1: React for the Frontend</h3>
<p><strong>Why:</strong> React enables fast, responsive user interfaces that support quick searching, filtering, and browsing of listings. This directly addresses Alex’s need to find specific items efficiently without wasting time on cluttered or slow platforms. React’s component-based structure also supports building clear, reusable listing views that help Maya quickly understand item details and trust what she is seeing.</p>
<p><strong>AI Usage:</strong> AI was used to help break down the Product Catalog feature into reusable UI components and to validate how search and filter interactions could be structured to remain responsive as listings grow.</p>

<br>

<h3>Decision 2: .NET Web API for the Backend</h3>
<p><strong>Why:</strong> .NET provides a structured and reliable API layer for handling product data, user accounts, and messaging between buyers and sellers. This supports Jordan’s need for clear, dependable communication and reduces frustration caused by slow or inconsistent responses when coordinating meetups.</p>
<p><strong>AI Usage:</strong> AI was used to outline a minimal set of REST API endpoints needed to support product browsing and buyer–seller messaging, which were then compared against the API-first patterns discussed in lecture.</p>

<br>

<h3>Decision 3: SQL Database</h3>
<p><strong>Why:</strong> A relational SQL database is well suited for storing structured data such as users, products, categories, messages, and meetup details. This supports Maya’s need for trustworthy listings with clear descriptions, consistent seller information, and reliable message history.</p>
<p><strong>AI Usage:</strong> AI was used to review the high-level ERD and confirm that the main entities and relationships support the prioritized user stories without adding unnecessary complexity.</p>

<br>

<h3>Decision 4: GitHub for Project Management</h3>
<p><strong>Why:</strong> GitHub Projects provides a Kanban-style workflow for organizing and prioritizing features, which supports the course requirement and helps ensure that high-impact features like Product Catalog and Messaging are addressed first.</p>
<p><strong>AI Usage:</strong> AI was used to help translate journey map pain points into Must-Have and Should-Have features when organizing the GitHub Project board.</p>

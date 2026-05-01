# ADR-0005: Production Deployment (Azure App Service)

## Status
Accepted

## Context
Buckeye Marketplace needed:
- Production hosting for frontend and backend
- Automatic deployments from GitHub
- Managed infrastructure (no manual server provisioning)
- HTTPS support for secure credential transmission
- Scalability for future student user base

## Decision
Adopted **Azure App Service** (PaaS) for hosting both frontend and backend.

Azure App Service was chosen because:
1. Managed platform: OS patching, runtime updates handled automatically
2. Git integration: supports automated deployments from GitHub Actions
3. Built-in HTTPS with managed certificates
4. Scalable: can adjust compute tier as user load increases
5. Cost-effective: pay-per-use pricing; free tier available for learning
6. Ecosystem: tight integration with other Azure services (Key Vault for secrets, SQL Database, Application Insights)

## Consequences

### Positive
- Fully managed infrastructure; less ops burden
- Automatic scaling and load balancing
- Built-in monitoring and diagnostics
- HTTPS automatic (no certificate management)
- Easy rollback if deployment fails

### Negative
- Vendor lock-in to Azure ecosystem
- Cold start times for consumption tier
- More expensive than self-managed VMs for very high traffic (though student marketplace unlikely to hit that)
- Less control over runtime environment compared to IaaS

## Alternatives Considered
1. **Heroku** – Simpler deployment, but smaller free tier and higher cost at scale
2. **Self-hosted (DigitalOcean, Linode)** – Lower cost, more control, but requires ops expertise
3. **AWS (EC2/Lambda)** – Similar to Azure, different ecosystem; more complex setup for beginners

## Deployment Architecture
- **Frontend**: Static assets (HTML/CSS/JS from Vite build) deployed to App Service via ZipDeploy
- **Backend**: ASP.NET Core application compiled and published, deployed via App Service Deploy action
- **Database**: Azure SQL Database (SQL Server managed service)
- **Secrets**: JWT key and connection strings stored in Azure Key Vault, injected at runtime

## Current Production Endpoints
- Frontend: https://marketplace-frontend-nhi2.azurewebsites.net/
- Backend: https://marketplace-backened-nhi2-gxb5gpcthkcqcja9.canadacentral-01.azurewebsites.net/

## Implementation Notes
- Publish profiles downloaded from Azure Portal and stored as GitHub secrets
- Frontend deploys when `frontend/**` or workflow file changes
- Backend deploys when `backend/**` or workflow file changes
- Both can be manually triggered via GitHub Actions workflow dispatch

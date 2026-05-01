# ADR-0006: CI/CD Pipeline (GitHub Actions)

## Status
Accepted

## Context
Buckeye Marketplace required:
- Automated testing on every code change
- Automated deployment to production on successful tests
- Fast feedback loop for developers
- No manual build/test steps before deployment
- Tracking of deployment history and success/failure

## Decision
Adopted **GitHub Actions** as the CI/CD pipeline orchestrator.

GitHub Actions was chosen because:
1. Native GitHub integration: no external tool setup; workflows live in source control
2. Free for public repositories and generous minutes for private repos
3. Pre-built actions for common tasks (checkout, setup Node/dotnet, deploy to Azure)
4. Matrix testing: run same workflow across multiple OS/runtime versions
5. Secrets management built-in: store API keys, publish profiles without exposing them

## Consequences

### Positive
- Workflow code lives in GitHub alongside source code (version controlled)
- Secrets automatically encrypted and never logged
- Free tier sufficient for student project
- Easy to audit deployment history (GitHub Actions run logs)
- Native integration with Azure App Service deploy actions

### Negative
- GitHub-specific (can't easily move CI to another platform without rewriting)
- Minutes quota can be limiting for very frequent deployments (mitigated by selective path triggers)
- Debugging workflow failures can be harder than local testing

## Alternatives Considered
1. **GitLab CI/CD** – Similar capabilities, but project is already on GitHub
2. **Jenkins** – Powerful but requires self-hosted infrastructure and more setup
3. **CircleCI** – Good alternative, but GitHub Actions is built-in and sufficient

## Pipeline Architecture

### Frontend Workflow (`.github/workflows/frontend-deploy.yml`)
1. **Trigger**: Push to main with changes in `frontend/**` or workflow file
2. **Build**: `npm install` and `npm run build` on Node 22
3. **Test**: `npm run test:run`
4. **Deploy**: Zip build artifact and upload to Azure App Service via ZipDeploy
5. **Fallback**: Manual workflow dispatch available if needed

### Backend Workflow (`.github/workflows/backend-deploy.yml`)
1. **Trigger**: Push to main with changes in `backend/**` or workflow file
2. **Restore**: `dotnet restore` on .NET SDK 10.0
3. **Build**: `dotnet build` in Release mode
4. **Test**: `dotnet test` with integrated test host
5. **Publish**: `dotnet publish` to output directory
6. **Deploy**: Use `azure/webapps-deploy@v3` action to push published package to Azure App Service

## Current Status
- Both workflows pass on main branch
- Latest successful runs linked in `docs/testing-qa-plan-m6.md`
- Deployment history visible in GitHub Actions tab

## Implementation Notes
- `VITE_API_URL` injected as environment variable during frontend build
- Backend JWT key and secrets stored as GitHub secrets, not in workflows
- Audit trail: every deployment logs to GitHub Actions run history
- Rollback: previous App Service deployment slot can be manually promoted if needed

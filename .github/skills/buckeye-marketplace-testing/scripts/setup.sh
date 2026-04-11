#!/bin/bash

# Setup script for Buckeye Marketplace Testing Frameworks
# Run this once to install xUnit, Vitest, and Playwright
# Usage: ./setup.sh

set -e  # Exit on error

echo "🧪 Setting up Buckeye Marketplace Test Frameworks..."
echo ""

# ============================================================================
# BACKEND: xUnit + Moq + FluentAssertions
# ============================================================================
echo "📦 Backend: Installing xUnit + Moq + FluentAssertions..."

cd backend

# Create test project
dotnet new xunit -n BuckeyeMarketplaceApi.Tests --force

cd BuckeyeMarketplaceApi.Tests

# Install test dependencies
dotnet add package Moq
dotnet add package FluentAssertions

# Add reference to API project
dotnet add reference ../BuckeyeMarketplaceApi/BuckeyeMarketplaceApi.csproj

cd ..

# Build to ensure everything compiles
dotnet build

echo "✅ Backend test setup complete"
echo ""

# ============================================================================
# FRONTEND: Vitest + React Testing Library
# ============================================================================
echo "📦 Frontend: Installing Vitest + React Testing Library..."

cd ../frontend

# Install Vitest and testing libraries
npm install --save-dev \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @types/node

# Create Vitest config if it doesn't exist
if [ ! -f "vitest.config.ts" ]; then
  npx vitest --init << EOF
1
2
EOF
fi

echo "✅ Frontend test setup complete"
echo ""

# ============================================================================
# E2E: Playwright
# ============================================================================
echo "📦 E2E: Installing Playwright..."

# Install Playwright
npm install --save-dev @playwright/test

# Download browsers (required once)
npx playwright install

echo "✅ E2E test setup complete"
echo ""

# ============================================================================
# Summary
# ============================================================================
echo "🎉 All test frameworks installed!"
echo ""
echo "Next steps:"
echo ""
echo "Backend tests:"
echo "  cd backend && dotnet test"
echo ""
echo "Frontend tests:"
echo "  cd frontend && npm test -- --run"
echo ""
echo "E2E tests (start servers first):"
echo "  cd frontend && npx playwright test"
echo ""
echo "Happy testing! 🧪"

@echo off
REM Setup script for Buckeye Marketplace Testing Frameworks (Windows)
REM Run this once to install xUnit, Vitest, and Playwright
REM Usage: setup.bat

setlocal enabledelayedexpansion

echo.
echo 🧪 Setting up Buckeye Marketplace Test Frameworks...
echo.

REM ============================================================================
REM BACKEND: xUnit + Moq + FluentAssertions
REM ============================================================================
echo 📦 Backend: Installing xUnit + Moq + FluentAssertions...

cd backend

REM Create test project
echo Creating xUnit test project...
dotnet new xunit -n BuckeyeMarketplaceApi.Tests --force

cd BuckeyeMarketplaceApi.Tests

REM Install test dependencies
echo Adding Moq...
dotnet add package Moq

echo Adding FluentAssertions...
dotnet add package FluentAssertions

REM Add reference to API project
echo Adding reference to API project...
dotnet add reference ../BuckeyeMarketplaceApi/BuckeyeMarketplaceApi.csproj

cd ..

REM Build to ensure everything compiles
echo Building backend...
dotnet build

echo ✅ Backend test setup complete
echo.

REM ============================================================================
REM FRONTEND: Vitest + React Testing Library
REM ============================================================================
echo 📦 Frontend: Installing Vitest + React Testing Library...

cd ..\frontend

REM Install Vitest and testing libraries
echo Installing npm packages...
call npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/node

echo ✅ Frontend test setup complete
echo.

REM ============================================================================
REM E2E: Playwright
REM ============================================================================
echo 📦 E2E: Installing Playwright...

echo Installing Playwright...
call npm install --save-dev @playwright/test

echo Downloading Playwright browsers (this may take a minute)...
call npx playwright install

echo ✅ E2E test setup complete
echo.

REM ============================================================================
REM Summary
REM ============================================================================
echo 🎉 All test frameworks installed!
echo.
echo Next steps:
echo.
echo Backend tests:
echo   cd backend ^&^& dotnet test
echo.
echo Frontend tests:
echo   cd frontend ^&^& npm test -- --run
echo.
echo E2E tests (start servers first):
echo   cd frontend ^&^& npx playwright test
echo.
echo Happy testing! 🧪
echo.

cd ..\..

pause

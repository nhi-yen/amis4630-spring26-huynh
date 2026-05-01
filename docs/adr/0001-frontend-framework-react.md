# ADR-0001: Frontend Framework (React)

## Status
Accepted

## Context
Buckeye Marketplace required a frontend framework that could:
- Support fast, responsive user browsing to address Alex's need for efficient item discovery
- Build reusable, testable UI components
- Integrate with a REST API backend
- Support modern development practices (TypeScript, component state management, routing)

## Decision
Adopted **React 19** with **TypeScript** and **Vite** as the build tool.

React was chosen because:
1. Component-based architecture aligns with Atomic Design and supports clear, reusable listing views
2. Virtual DOM enables fast re-renders for interactive features like cart updates and filtering
3. Strong ecosystem for routing (React Router), state management (Context API + useReducer), and testing (Vitest, RTL)
4. TypeScript enforcement prevents runtime errors in data binding and prop handling
5. Vite provides fast HMR (hot module replacement) for local development

## Consequences

### Positive
- Fast development iteration with Vite HMR
- Strong type safety with TypeScript across components and services
- Large ecosystem of tested libraries (axios, react-router-dom)
- Easy to test components in isolation (Vitest + React Testing Library)
- Deployment-ready: builds to static assets (HTML/CSS/JS)

### Negative
- Requires learning React concepts (hooks, state, context) beyond vanilla JavaScript
- JavaScript bundle size increases with dependencies (mitigated by tree-shaking and minification)

## Alternatives Considered
1. **Vue** – Lighter alternative, but smaller ecosystem for this project's scale
2. **Angular** – More opinionated, heavier framework; overkill for this marketplace scope
3. **Vanilla JavaScript** – Simpler initially, but would require manual state management and DOM updates as features grow

## Implementation Notes
- useReducer for complex state (Cart, Auth)
- useState for simple state (form inputs, UI flags)
- Context API for global state (Cart, Auth) to avoid prop drilling
- CSS Modules for scoped styling (no global CSS or inline styles)
- Axios as HTTP client with interceptors for JWT token attachment

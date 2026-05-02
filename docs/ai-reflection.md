# AI Tool Reflection - Buckeye Marketplace M1-M6

This reflection summarizes how AI tools were used across the project lifecycle, what value they provided, where they struggled, and what I learned from AI-assisted development.

---

## 1. AI Tools Used

### GitHub Copilot
- **When:** M1-M6
- **Used for:** Code scaffolding, refactoring, tests, documentation drafting, and quick debugging iterations.
- **Best at:** Speed, boilerplate generation, and context-aware in-editor suggestions.

### Claude (via Copilot Chat)
- **When:** Primarily M4-M6
- **Used for:** Architecture reasoning, troubleshooting workflows, testing strategy, and rubric-aligned documentation revisions.
- **Best at:** Multi-step reasoning, tradeoff analysis, and longer-form technical writing.

---

## 2. How AI Was Used Across SDLC Phases

### M1: Research and Planning
- Refined personas, journey map language, and user story quality.
- Helped brainstorm a large feature list and then prioritize must-have vs should-have scope.

**Example prompts and outcomes:**
- "Help me refine my personas' goals and challenges." -> clearer persona goals and pain points.
- "Based on my journey map, generate 30 possible features for a student marketplace." -> broad ideation, then narrowed to realistic scope.

### M2: Architecture and Design
- Validated frontend/backend/database stack choices.
- Helped structure component hierarchy and ADR documentation approach.

**Outcome:** Stronger architecture documentation and clearer decision rationale.

### M3-M4: Implementation (Catalog and Cart)
- Generated API-fetching patterns and loading/error handling templates.
- Scaffolded reducer/context code, cart API service methods, and DTO/validator/controller starting points.

**Specific example:**
- AI generated initial cart reducer logic, but the duplicate-item quantity behavior was wrong.
- I revised logic to correctly merge quantities and keep immutable updates.
- AI also provided a first-pass Cart API layer (`getCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart`) that I then aligned to project-specific endpoint and error-handling behavior.

**Outcome:** Catalog and cart moved from mock-first behavior to real backend-backed workflows with consistent loading/error handling.

### M5: Security, Auth, and Testing
- Helped implement JWT auth flows and protected routing patterns.
- Assisted in debugging backend tests requiring authenticated user context.
- Updated E2E selectors after checkout UI changes.

**Specific examples:**
- Backend tests initially failed against protected endpoints because authentication context was missing; AI-guided setup of authenticated test context resolved the issue.
- Auth persistence had early issues (login state lost on refresh); AI suggested a restore-on-mount reducer action flow, which I implemented with safe storage parsing and fallback handling.
- Checkout E2E tests broke after UI field changes; AI helped map old selectors to current aria-label based selectors.

**Outcome:** Stable auth behavior, passing tests, and improved security checks.

### M6: Deployment, QA, and Documentation
- Helped troubleshoot CI/CD failures and deployment configuration issues.
- Assisted with screenshot automation and QA evidence organization.
- Supported final documentation cleanup (README, architecture docs, ADR structure, user/admin guide updates).

**Specific examples:**
- Deployment troubleshooting: AI helped narrow failures to configuration and credentials issues instead of build logic.
- QA evidence quality: AI-assisted screenshot recapture flows addressed false captures (loading states, redirect states) and improved submission-readiness.
- Documentation correction: AI was used to replace outdated conceptual architecture text with implementation-accurate M6 details (Product/Cart/Order model and ADR index format).

**Outcome:** Production deployment, green pipelines, and complete submission documents.

---

## 3. What Worked Well

- **Speed:** Rapid generation of scaffolding (DTOs, validators, test skeletons, doc sections).
- **Debugging support:** Useful root-cause hypotheses and step-by-step fix paths.
- **Documentation quality:** Good at restructuring content for clarity and rubric alignment.
- **Learning support:** Helped explain patterns (immutability, auth flow, API layering) while I validated implementation.

In practice, the highest-value workflow was: generate draft -> review against project conventions -> run tests -> request targeted fixes. This iterative pattern consistently produced better outcomes than accepting first-pass output.

---

## 4. What Did Not Work Well

- **Edge-case logic mistakes:** Initial drafts occasionally missed behavior details (for example, reducer merge logic).
- **Project-context gaps:** Some suggestions assumed incorrect imports/paths or missed local conventions.
- **UI test fragility:** Playwright selectors and timing often needed manual correction after UI changes.
- **Infrastructure specifics:** Azure/GitHub Actions guidance was directionally helpful but still required hands-on verification.

Another recurring issue was that AI often optimized for "a working example" rather than "my exact codebase constraints." The quality improved substantially only after I provided explicit context (existing routes, DTO shapes, naming conventions, and rubric requirements).

---

## 5. Impact on Productivity and Learning

### Productivity Impact
- AI significantly reduced time spent on repetitive setup work.
- Most value came from first drafts plus iterative refinement, not direct copy-paste completion.
- Estimated time savings were meaningful across M1-M6, especially in documentation and testing setup.

The biggest productivity gains came late in the project during M6 documentation and QA packaging, where AI accelerated restructuring, consistency checks, and evidence-link alignment.

### Learning Impact
- Improved my code review discipline by checking AI output for correctness.
- Strengthened my understanding of architecture tradeoffs, auth/security, and testing reliability.
- Improved prompt quality over time, which improved output quality.

I also became better at writing constraint-aware prompts (for example: required tech stack, exact file paths, expected behavior, and rubric target). Better prompts directly reduced rework.

---

## 6. Key Lessons Learned

1. **Treat AI as a collaborator, not an autopilot.**
   - Generated output must be reviewed, tested, and validated.

2. **Provide clear project context early.**
   - Conventions, folder structure, and constraints improve response accuracy.

3. **Use AI where leverage is highest.**
   - Boilerplate, documentation, and debugging guidance gave the best returns.

4. **Keep humans in charge of decisions.**
   - Prioritization, architecture tradeoffs, and production-readiness checks require human judgment.

5. **Iterative prompting works best.**
   - Precise follow-ups and targeted correction produce high-quality final results.

---

## 7. Conclusion

AI tools (Copilot and Claude) materially improved development speed and documentation quality for Buckeye Marketplace. The strongest results came from pairing AI-generated drafts with manual validation, testing, and architecture judgment. Across M1-M6, AI was most valuable as a productivity multiplier and learning aid, while final quality still depended on disciplined engineering review.

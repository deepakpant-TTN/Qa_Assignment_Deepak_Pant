# AI prompts — Automation and debugging

Prompt history for PrismStructure Playwright UI/API work and failure analysis. Commit-only UI actions are omitted unless they accompanied a design decision.

**QA engineer decisions** are labeled separately from AI suggestions.

---

## Entry

### Prompt

Inspect the existing repository and Prism Playwright structure. Explain folder conventions, page objects, fixtures/utilities, test-data handling, tagging, UI/API execution, and report configuration. Follow existing patterns. Do not modify files yet.

### AI Response Summary

AI inspected the repo and reported that a Prism/Playwright tree was not yet present (only planning/manual artifacts on `assesment` at that time), so there were no existing conventions to follow beyond assessment naming (`PrismStructure/`).

### Validation Notes

Read-only step as requested. Scaffolding followed in the next prompt.

### Changes I Made

None (explicitly no file modifications).

### Reason for Changes

Establish baseline before scaffolding.

---

## Entry

### Prompt

Set up the minimum Playwright JavaScript structure for UI and API testing of Toolshop. Follow Prism conventions; reusable page objects and API helpers; separate test data; `@smoke`/`@regression`; HTML reports; env URLs; no hardcoded credentials/tokens; no unnecessary dependencies. Explain each modified file afterward.

### AI Response Summary

AI scaffolded `PrismStructure/` with `package.json`, `playwright.config.js` (ui-chromium + api projects, HTML/JSON reporters), `pages/`, `api/`, `fixtures/testFixtures.js`, `data/`, `utils/env.js`, and initial smoke placeholders.

### Validation Notes

Single dependency `@playwright/test`. URLs via `UI_BASE_URL` / `API_BASE_URL`.

### Changes I Made

- Created `PrismStructure/` framework layout (committed on `assesment`)

### Reason for Changes

Provide the required PrismStructure automation foundation.

---

## Entry

### Prompt

Implement Playwright UI tests for successful registration and login, and invalid login validation. Use Prism page objects; unique runtime user data; stable locators; explicit assertions; tag success `@smoke` and invalid login `@regression`; no fixed waits.

### AI Response Summary

AI implemented UI auth specs and page objects for register/login flows with runtime-unique users and tagged cases.

### Validation Notes

Auth smoke/regression present under `PrismStructure/tests/ui/auth.spec.js`.

### Changes I Made

- UI auth tests and related page-object updates

### Reason for Changes

Cover UI-AC1 authentication paths within the lean suite.

---

## Entry

### Prompt

Implement a Playwright E2E UI test: register/login, browse/search, add multiple products, update quantity, verify cart, COD checkout, handle double confirmation safely, open My Invoices, verify invoice. Follow Prism conventions; tag `@smoke` and `@regression`.

### AI Response Summary

AI implemented COD E2E in `checkout.e2e.spec.js` with checkout page methods for billing, COD selection, and confirm-twice + `POST /invoices` handling; invoice asserted under My Invoices. Live learning used during implementation (e.g. wait for add-to-cart feedback; TG billing sample).

### Validation Notes

Double-confirm behavior encoded in `CheckoutPage.confirmTwiceAndCreateInvoice`. Test tagged `@smoke` `@regression`.

### Changes I Made

- Added/updated E2E UI checkout test and checkout/cart/product/invoice page objects

### Reason for Changes

Satisfy UI-AC2 purchase and invoice acceptance criteria.

---

## Entry

### Prompt

Review the API documentation at the Toolshop API docs URL. Identify exact endpoints, bodies, auth, and expected statuses for register, login, products, cart create/add/verify, and invoice generation. Do not guess undocumented fields. Report uncertainties before writing tests.

### AI Response Summary

AI listed contract findings and uncertainties (cart schema, invoice status 200 vs live 201, undocumented login error shapes, etc.) without writing the suite yet.

### Validation Notes

Held for engineer go-ahead.

### Changes I Made

None in this step.

### Reason for Changes

Prevent invented API assertions.

---

## Entry

### Prompt

`you can write yourself` (after the API documentation review).

### AI Response Summary

AI implemented an initial API suite (auth, products, cart, COD invoice) with helpers, unique users, and practical handling of doc gaps (e.g. invoice 200/201).

### Validation Notes

QA engineer decision: authorize AI to resolve uncertainties and write tests. Initial API run reported **8/8 passed** in that session.

### Changes I Made

- API specs/helpers under `PrismStructure/tests/api` and `api/` / `data/users.js` updates
- Committed/pushed on `assesment`

### Reason for Changes

Engineer-approved move from contract review to API automation.

---

## Entry

### Prompt

Implement Playwright API tests for the Toolshop lifecycle (register → login/token → products → create cart → add products → verify cart → COD invoice → validate response). Reusable helpers; dynamic IDs; isolated data; explicit status/schema/value assertions; no hardcoded IDs/tokens; use `@smoke`/`@regression`.

### AI Response Summary

AI added `ToolshopLifecycle` + `apiAssert` helpers and a lifecycle `@smoke` test covering all eight steps; consolidated overlapping specs; kept suite within 5–8 API tests. Empty-cart invoice negative was attempted then replaced after live API accepted empty cart.

### Validation Notes

Lifecycle smoke passed. Observed empty-cart invoice success led to replacing that negative with missing-`cart_id` / invalid payload cases later.

### Changes I Made

- `api/ToolshopLifecycle.js`, `utils/apiAssert.js`, `tests/api/checkout.lifecycle.api.spec.js`, related auth/products/invoice adjustments

### Reason for Changes

Meet API-AC1/API-AC2 as an explicit reusable lifecycle.

---

## Entry

### Prompt

Add high-value negative API tests while keeping the complete API suite between 5 and 8 tests. Consider invalid login, missing/invalid bearer, invalid product/cart ID, invalid invoice payload, missing required fields. Assert status and relevant error body; do not assume status codes without checking API behavior or documentation.

### AI Response Summary

AI probed live error responses, then added `api.negative.spec.js` with observed statuses/bodies (e.g. login 401 `{error: Unauthorized}`, invoice auth 401 `{message: Unauthorized}`, product/cart 404, validation 422). Dropped lower-value duplicate-email case to stay within limit. Final API count: **8**.

### Validation Notes

Statuses taken from live probes, not assumed. Suite remained ≤8.

### Changes I Made

- Added `tests/api/api.negative.spec.js`; strengthened auth invalid-login assertions; removed/replaced weaker invoice negatives as needed

### Reason for Changes

High-value regression negatives with evidence-based error assertions.

---

## Entry

### Prompt

Run the `@smoke` Playwright tests first. For every failure: classify product defect / test defect / test-data / locator / environment; show evidence; suggest smallest correction. Do not weaken assertions or hide failures.

### AI Response Summary

AI ran smoke (PowerShell required quoting `@smoke`). Result: **5 passed, 1 failed** — COD E2E. Classification: **test defect** (billing fill sequencing). Evidence: `proceed-3` disabled; screenshot showed empty house number despite data providing `42`. Suggested filling house number after autofill and asserting enabled—without weakening assertions.

### Validation Notes

Failure was real; not treated as a product defect because Proceed correctly stayed disabled without house number.

### Changes I Made

None in the analysis-only step (fix applied in the next prompt after engineer asked to fix).

### Reason for Changes

Honest failure triage before changing code.

---

## Entry

### Prompt

Analyze this Playwright failure using error, trace, screenshot, and source. Find root cause. Apply smallest reliable fix. Do not add arbitrary timeouts, fixed waits, force clicks, or broad exception handling. Explain how the fix preserves the intended assertion.

### AI Response Summary

Root cause: address-form updates cleared required house number, leaving Proceed disabled. Fix in `CheckoutPage.fillBillingDetails`: fill house number last, Tab/blur, assert value and that `proceed-3` is enabled. Re-ran targeted E2E and full smoke: **passed**.

### Validation Notes

Intended assertion preserved: checkout proceeds only with a valid billing form (no force-click).

### Changes I Made

- Updated `PrismStructure/pages/CheckoutPage.js`
- Committed/pushed on `assesment`

### Reason for Changes

Fix test sequencing defect without hiding validation.

---

## Entry

### Prompt

Run the complete UI and API regression suite. Confirm all tests pass; UI/API/Smoke/Regression commands work; HTML reports generated; no credentials/tokens in code/logs/reports/commits; counts remain 5–8 per category. Provide a concise execution summary.

### AI Response Summary

AI ran full suite (**15 passed** initially). `npm run test:smoke` passed (6). `npm run test:regression` then failed once on COD E2E waiting for second Confirm / `POST /invoices` under parallel load (screenshot still on payment success). AI began hardening double-confirm (`Promise.all` listener+click) and raising E2E timeout for parallel headroom. Counts: manual 8, UI 7, API 8. Reports paths confirmed under `reports/html` and `reports/json`. Secret scan found no hard-coded bearer JWTs (fixture password pattern only).

### Validation Notes

Regression was **not** clean on first pass due to the COD flake; a follow-up hardening commit was made. Full re-validation of all command groups after that fix was interrupted in-session before a final all-green confirmation was recorded in chat.

### Changes I Made

- Updated `CheckoutPage.confirmTwiceAndCreateInvoice` and E2E `test.setTimeout(180_000)`
- Committed as “Harden COD double-confirm invoice wait under parallel load”

### Reason for Changes

Address observed flake without force-click or sleeping; keep invoice assertion tied to real `POST /invoices`.

# Project Info — Toolshop QA Assessment

## Project summary

This repository contains a lean QA assessment for the public **Practice Software Testing Toolshop** demo. Work covers requirement extraction, application-specific risk analysis, an eight-case manual suite, and a Playwright **PrismStructure** framework with UI and API automation tagged `@smoke` / `@regression`. Delivery was built iteratively on the `assesment` branch with Cursor-assisted analysis, design, automation, and debugging.

**Current automated counts (within the 5–8 limit per category):**

| Category | Count | Location |
|----------|-------|----------|
| Manual | 8 | `FunctionalTestCase.csv` |
| UI automation | 7 | `PrismStructure/tests/ui/` |
| API automation | 8 | `PrismStructure/tests/api/` |

## Application under test

| Layer | URL |
|-------|-----|
| UI | https://practicesoftwaretesting.com/ |
| API | https://api.practicesoftwaretesting.com |
| API docs | https://api.practicesoftwaretesting.com/api/documentation (OpenAPI JSON also used) |

**In-scope customer journeys:** registration, login, product browse/search, cart (multi-item + quantity), Cash on Delivery checkout, UI double-confirm invoice creation, My Invoices verification, and the parallel API lifecycle (register → login → products → cart → COD invoice) plus negative auth/cart/invoice checks.

**Out of scope for this Core suite:** admin flows, non-COD payment methods beyond selection existence, performance/accessibility matrices, multi-browser coverage, and wishlist/contact/i18n (documented in `requirement-risk-analysis.md`).

## Tools used

- **Cursor** — AI-assisted requirements extraction, risk analysis, test design, Playwright implementation, and failure diagnosis
- **Playwright** (`@playwright/test`) — UI and API automation
- **PrismStructure** — project-local page objects, API helpers, fixtures, data builders, and reporters under `PrismStructure/`
- **Node.js / npm** — package scripts for smoke, regression, UI-only, and API-only runs
- **Git / GitHub** — iterative commits on public branch `assesment`
- **CSV** — manual functional cases in `FunctionalTestCase.csv`

Environment URLs are configured via `UI_BASE_URL` / `API_BASE_URL` (defaults in `PrismStructure/utils/env.js`). See `PrismStructure/README.md` for setup and commands.

## Scope and acceptance criteria

Acceptance criteria are extracted in `assessment-requirements.md` and implemented as follows.

### UI-AC1 — Registration, login, and profile

- UI registers a unique user, logs in, and asserts authenticated navigation (name in menu / account URL).
- Covered by `tests/ui/auth.spec.js` (`@smoke`) and manual `TC-MAN-01` / `TC-MAN-02`.

### UI-AC2 — End-to-end purchase and invoice

- Browse/search, add multiple products, update quantity, COD checkout, **Confirm twice**, verify invoice under My Invoices.
- Covered by `tests/ui/checkout.e2e.spec.js` (`@smoke` `@regression`) and manual `TC-MAN-03`–`TC-MAN-07`.
- Edge/negative UI: empty cart blocked (`cart-checkout.edge.spec.js`), single confirm does not create invoice, invalid search empty results.

### API-AC1 — Authentication and cart creation

- Register, login, validate bearer token, create cart (as part of lifecycle).
- Covered by `tests/api/auth.api.spec.js` and `tests/api/checkout.lifecycle.api.spec.js`.

### API-AC2 — Product selection and invoice generation

- Retrieve products, add selected products, verify cart contents, create COD invoice, validate response schema/values.
- Covered by lifecycle smoke plus `products.smoke.spec.js`; negatives in `api.negative.spec.js`.

## Requirement and risk analysis

Full analysis lives in `requirement-risk-analysis.md`. Summary of priorities applied in this repo:

| Flow | Priority | Why it matters in this suite |
|------|----------|------------------------------|
| Registration / login | P0 | Gate for all authenticated purchase and invoice paths |
| Cart + quantities | P0 | Totals and line items must match the eventual invoice |
| COD checkout | P0 | Primary purchase path for the assessment |
| UI double confirm | P0 | Product-specific gate; one confirm must not finalize |
| Invoice verification | P0 | Proof of purchase; UI My Invoices + API response checks |
| Search / browse | P1 | Feeds cart seeding; empty-search covered as regression |
| Authz on invoice API | P0 process | Missing/invalid bearer must be rejected |

Cross-cutting controls reflected in automation: unique emails per run, dynamic product/cart/invoice IDs (no hardcoded IDs), and synthetic billing data (TG + `1234AA` address validated against live behavior).

## UI / API strategy

### UI (`PrismStructure/pages` + `tests/ui`)

- **Page Object Model** for Home, Register, Login, Product, Cart, Checkout, Profile, Invoices.
- Playwright `data-test` attribute (`testIdAttribute: 'data-test'`).
- Fixtures in `fixtures/testFixtures.js` inject page objects.
- Auto-waiting / `expect` used instead of fixed sleeps; billing fill order and double-confirm invoice wait hardened against live form/network timing without force-clicks.

### API (`PrismStructure/api` + `tests/api`)

- Reusable clients: `ApiClient`, `AuthApi`, `ProductApi`, `CartApi`, `InvoiceApi`.
- Lifecycle orchestration: `ToolshopLifecycle.js`.
- Shared assertions: `utils/apiAssert.js` (status, schema, and observed error shapes).
- Contracts validated against OpenAPI/docs where documented; runtime behavior verified for ambiguous cases (for example invoice create **200 or 201**, cart `cart_items` on GET).

## Smoke / Regression strategy

| Tag | Intent | Examples in repo |
|-----|--------|------------------|
| `@smoke` | Fast confidence on P0 happy paths | Home reachable; UI register+login; UI COD E2E; API auth; products list; API full lifecycle |
| `@regression` | Negatives, edges, and deeper checkout checks | Invalid login; empty search; empty cart; single confirm; API unauthorized/invalid IDs/payload validation |

Commands (from `PrismStructure/`):

```bash
npm test                 # UI + API
npm run test:smoke       # --grep @smoke
npm run test:regression  # --grep @regression
npm run test:ui
npm run test:api
npm run report           # reports/html
```

HTML and JSON reporters are configured in `playwright.config.js` (`reports/html`, `reports/json/results.json`). Failure artifacts (screenshot/video) go under `reports/test-results`.

## Positive / negative / edge coverage

| Type | Manual | UI | API |
|------|--------|----|-----|
| Positive / functional | TC-MAN-01, 03–07 | Auth smoke, home smoke, COD E2E | Auth smoke, products smoke, lifecycle smoke |
| Negative | TC-MAN-02 | Invalid login, invalid search | Invalid login; missing/invalid bearer; invalid product_id; missing/invalid invoice fields |
| Edge | TC-MAN-08 | Empty cart cannot proceed; single confirm ≠ invoice | Invalid product/cart IDs (404); unknown cart_id on invoice (404) |

## Test-data strategy

| Concern | Approach in repo |
|---------|------------------|
| Users | `data/users.js` — `buildUniqueUser` / `buildUniqueApiUser` with timestamped `@example.com` emails |
| Passwords | Default fixture password or `TEST_USER_PASSWORD`; optional `TEST_USER_EMAIL` for pre-seeded users — never commit real credentials |
| Checkout address | `data/checkout.js` — assessment sample address (TG / `1234AA` / Zoey Shore) used for COD UI and API invoice payloads |
| Products | `data/products.js` search keywords; runtime product IDs selected from `GET /products` |
| IDs / tokens | Cart, product, invoice IDs and bearer tokens obtained at runtime only; not hard-coded in specs |

Manual CSV uses placeholder unique emails and the same synthetic address/password patterns; ActualResult/Status columns are left for execution recording.

## How AI was used

Work was produced in Cursor through iterative prompts aligned to assessment phases (evidence: commits on `assesment` from requirements → manual CSV → PrismStructure scaffold → UI → API lifecycle → negatives → flake fixes).

| Phase | AI-assisted activity reflected in the repo |
|-------|--------------------------------------------|
| Planning | Extracted deliverables/ACs/ambiguities into `assessment-requirements.md` |
| Design | Flow risks, priorities, and lean traceability in `requirement-risk-analysis.md`; manual cases in `FunctionalTestCase.csv` |
| Automation | PrismStructure POM/API helpers, fixtures, tagged specs, lifecycle helper, assertion utilities |
| Validation | Smoke/regression command design; assertions tied to documented or observed API statuses/bodies |
| Debugging | Billing house-number fill order (disabled Proceed); COD second Confirm + `POST /invoices` wait paired under parallel load |

AI output was reviewed against the live UI/API (OpenAPI + runtime probes) before locking assertions; uncertain docs (for example invoice status code) were handled with explicit dual-accept only where observed.

## Responsible AI and sensitive-data precautions

- No production secrets, private keys, or live customer data in the repository.
- Bearer tokens are obtained during test execution and asserted in-memory; they are not hard-coded.
- Synthetic names, `@example.com` emails, and fixture passwords only; password override via environment when needed.
- `.env` is not committed; `PrismStructure/README.md` and `utils/env.js` instruct against committing secrets.
- Negative API tests use deliberately invalid tokens (for example `invalid.bearer.token`), not real credentials.
- Prompts and code avoid asking models to invent undocumented security bypasses; unauthorized invoice access is tested as a rejection case.

## How this workflow can be reused

1. **Extract** requirements/ACs and ambiguities into a short markdown file.
2. **Risk-rank** flows (P0–P2) and map a 5–8 case lean suite per layer before coding.
3. **Seed** PrismStructure: env config, fixtures, page objects, API clients, data builders.
4. **Automate** smoke happy paths first (auth → cart → COD invoice), then add tagged negatives/edges without exceeding count limits.
5. **Assert** using documented contracts; verify live status/body when docs are silent; do not weaken assertions to hide flakes.
6. **Debug** with Playwright failure screenshot/error-context; fix root cause (locator/data/order/wait pairing), not force-clicks or fixed sleeps.
7. **Commit iteratively** per phase so review and rollback stay small.
8. **Report** via configured HTML/JSON reporters for submission evidence.

The same pattern applies to other demo or staging ecommerce targets by swapping base URLs, locators/`data-test` maps, and OpenAPI-derived helpers while keeping the smoke/regression and test-data isolation conventions.

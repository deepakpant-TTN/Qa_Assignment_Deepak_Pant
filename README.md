# Qa_Assignment_Deepak_Pant — Toolshop QA Assessment

Playwright UI and API automation for [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/), plus manual cases and requirement/risk documentation.

| Layer | Count | Location |
|-------|-------|----------|
| Manual | 8 | `FunctionalTestCase.csv` |
| UI automation | 7 | `PrismStructure/tests/ui/` |
| API automation | 8 | `PrismStructure/tests/api/` |

Branch used for iterative delivery: `assesment`.

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm
- Git
- Network access to:
  - UI: `https://practicesoftwaretesting.com`
  - API: `https://api.practicesoftwaretesting.com`

## Installation

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

All automation commands below are run from the `PrismStructure/` directory.

## Configuration (no secrets in the repo)

Defaults are public demo URLs in `PrismStructure/utils/env.js`. Override with environment variables (see `PrismStructure/.env.example`).

**PowerShell:**

```powershell
$env:UI_BASE_URL="https://practicesoftwaretesting.com"
$env:API_BASE_URL="https://api.practicesoftwaretesting.com"
```

**Optional (local only — never commit):**

```powershell
$env:TEST_USER_EMAIL="your-local-user@example.com"
$env:TEST_USER_PASSWORD="use-a-local-password"
```

| Variable | Purpose | Default |
|----------|---------|---------|
| `UI_BASE_URL` | UI base URL | `https://practicesoftwaretesting.com` |
| `API_BASE_URL` | API base URL | `https://api.practicesoftwaretesting.com` |
| `DEFAULT_TIMEOUT_MS` | Helper timeout hint | `30000` |
| `TEST_USER_EMAIL` | Optional pre-seeded user | unset |
| `TEST_USER_PASSWORD` | Optional password override | fixture default in code only if unset |

Do **not** commit `.env`, bearer tokens, or real credentials. Tests generate unique emails at runtime (`PrismStructure/data/users.js`).

## Test-data location

| Data | Path |
|------|------|
| Unique users / API register payload | `PrismStructure/data/users.js` |
| COD billing address + invoice payload builder | `PrismStructure/data/checkout.js` |
| Product search keywords | `PrismStructure/data/products.js` |
| Manual cases | `FunctionalTestCase.csv` |

Product, cart, and invoice IDs are selected dynamically from API/UI responses — not hard-coded in specs.

## Commands

Verified against `PrismStructure/package.json` and `playwright.config.js`.

From `PrismStructure/`:

| Goal | npm script | Equivalent |
|------|------------|------------|
| All UI + API | `npm test` | `playwright test` |
| Smoke (`@smoke`) | `npm run test:smoke` | `playwright test --grep @smoke` |
| Regression (`@regression`) | `npm run test:regression` | `playwright test --grep @regression` |
| UI only | `npm run test:ui` | `playwright test tests/ui` |
| API only | `npm run test:api` | `playwright test tests/api` |
| UI smoke | `npm run test:ui:smoke` | `playwright test tests/ui --grep @smoke` |
| API smoke | `npm run test:api:smoke` | `playwright test tests/api --grep @smoke` |

**PowerShell note:** quote the grep tag if invoking Playwright directly (`--grep "@smoke"`). npm scripts already embed the pattern.

Projects (from `playwright.config.js`):

- `ui-chromium` → `tests/ui` (Desktop Chrome, `UI_BASE_URL`)
- `api` → `tests/api` (`API_BASE_URL`)

`data-test` is configured as Playwright’s `testIdAttribute`.

## Reports

Configured reporters:

- **HTML:** `PrismStructure/reports/html` (open with `npm run report` or `npm run report:open`)
- **JSON:** `PrismStructure/reports/json/results.json`
- **Failure artifacts:** `PrismStructure/reports/test-results` (screenshots/video on failure; trace on first retry in CI)

```bash
cd PrismStructure
npm test
npm run report
```

HTML opens via `playwright show-report reports/html` (`open: 'never'` during the run).

## Repository structure

```text
Qa_Assignment_Deepak_Pant/
├── assessment-requirements.md      # Extracted ACs and deliverables
├── requirement-risk-analysis.md    # Flow risks and priorities
├── project-info.md                 # Assessment project write-up
├── FunctionalTestCase.csv          # 8 manual functional cases
├── README.md                       # This file
└── PrismStructure/                 # Playwright PrismStructure framework
    ├── package.json
    ├── playwright.config.js
    ├── .env.example
    ├── pages/                      # UI page objects
    ├── api/                        # API clients + ToolshopLifecycle
    ├── fixtures/testFixtures.js
    ├── data/                       # users, checkout, products
    ├── utils/                      # env, apiAssert
    ├── tests/ui/                   # 7 UI specs (@smoke / @regression)
    ├── tests/api/                  # 8 API specs (@smoke / @regression)
    └── reports/                    # Generated (html, json, test-results)
```

Related docs: `project-info.md`, `PrismStructure/README.md` (framework quick start).

## Known application behavior

Documented from live Toolshop behavior used by this suite:

1. **Invoice double confirmation (UI)**  
   On Payment, **Confirm** must be pressed **twice**:
   - First confirm → shows **Payment was successful** (order not finalized as invoice yet).
   - Second confirm → triggers `POST /invoices` and creates the invoice.  
   Covered by the COD E2E smoke/regression test and the single-confirm edge test (no invoice after one confirm).

2. **Billing address**  
   Country **TG** with postal code **1234AA** (assessment sample address) validates for COD. House number is required; country/postal updates can refresh address fields — house number is filled last in the page object.

3. **API invoice create**  
   OpenAPI may document `200`; live create often returns **201**. Lifecycle assertions accept either. Invoice create requires a bearer token.

4. **Cart GET**  
   OpenAPI documents cart `id`; live responses also include `cart_items` used for content verification.

5. **Auth errors**  
   Invalid login returns **401** with `{ "error": "Unauthorized" }`. Protected invoice calls without/invalid bearer return **401** with `{ "message": "Unauthorized" }`.

## Troubleshooting

| Symptom | Likely cause | What to check |
|---------|--------------|---------------|
| `npm` / Playwright not found | Dependencies or browsers missing | Run `npm install` and `npx playwright install chromium` from `PrismStructure/` |
| UI tests hit wrong site | `UI_BASE_URL` unset/wrong | Confirm env or defaults in `utils/env.js` |
| API 404 on base path | `API_BASE_URL` wrong | Must be `https://api.practicesoftwaretesting.com` (no trailing path required) |
| Proceed to checkout stays disabled | Empty house number after autofill | Use current `CheckoutPage.fillBillingDetails` (house number last + enabled assert) |
| Second Confirm times out waiting for invoice | Double-confirm / network timing under load | Ensure second click is paired with `waitForResponse` for `POST …/invoices`; E2E timeout is raised for parallel runs |
| Registration fails (email taken) | Non-unique email | Suite uses timestamped emails; avoid hard-coding emails in new tests |
| `@smoke` fails in PowerShell | `@` parsed as splatting | Use `npm run test:smoke` or `--grep "@smoke"` |
| Empty HTML report | Tests not run yet / wrong cwd | Run tests from `PrismStructure/`, then `npm run report` |
| Secrets concern | Local `.env` or printed tokens | Do not commit `.env`; do not log `access_token` values |

## Manual suite

Open `FunctionalTestCase.csv` for eight manual cases (`TC-MAN-01` … `TC-MAN-08`) mapped to UI-AC1 / UI-AC2 with Smoke/Regression/Edge tags. Fill **ActualResult** and **Status** during manual execution.

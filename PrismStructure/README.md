# PrismStructure — Playwright UI + API (Toolshop)

## Setup

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

## Environment

Set URLs (and optional credentials) via environment variables. See `.env.example`.

```powershell
$env:UI_BASE_URL="https://practicesoftwaretesting.com"
$env:API_BASE_URL="https://api.practicesoftwaretesting.com"
```

Do not commit `.env` or real tokens/passwords.

## Run

```bash
npm test                 # all tests
npm run test:smoke       # @smoke
npm run test:regression  # @regression
npm run test:ui          # UI project only
npm run test:api         # API project only
npm run report           # open HTML report under reports/html
```

## Layout

- `pages/` — UI page objects
- `api/` — API helpers
- `fixtures/testFixtures.js` — injects pages + API helpers
- `data/` — test data builders (no secrets)
- `tests/ui` / `tests/api` — specs tagged `@smoke` / `@regression`
- `reports/html` — HTML execution report (generated)

# PrismStructure — Toolshop Playwright framework

Quick start for the automation package. Full project documentation (overview, structure, known behaviors, troubleshooting) is in the repository root [`README.md`](../README.md).

## Setup

```bash
cd PrismStructure
npm install
npx playwright install chromium
```

## Configuration

See `.env.example`. Override `UI_BASE_URL` / `API_BASE_URL` via environment variables. Do not commit `.env` or secrets.

## Commands (from `package.json`)

```bash
npm test                 # playwright test (UI + API)
npm run test:smoke       # --grep @smoke
npm run test:regression  # --grep @regression
npm run test:ui          # tests/ui
npm run test:api         # tests/api
npm run test:ui:smoke    # tests/ui --grep @smoke
npm run test:api:smoke   # tests/api --grep @smoke
npm run report           # show-report reports/html
npm run report:open      # same as report
```

Reports: `reports/html`, `reports/json/results.json`, failures under `reports/test-results`.

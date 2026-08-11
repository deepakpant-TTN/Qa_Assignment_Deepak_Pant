# AI prompts — Test data

Prompt history focused on test-data strategy and builders. Related instructions also appear inside automation prompts; those overlaps are noted rather than duplicated as fake prompts.

**QA engineer decisions** are labeled separately from AI suggestions.

---

## Entry

### Prompt

(Embedded in framework setup and UI/API automation prompts.) Requirements included: keep test data separate from test logic; generate unique valid user data at runtime; do not hardcode credentials or tokens; do not hardcode bearer tokens, user credentials, cart IDs, product IDs, or invoice IDs.

### AI Response Summary

AI introduced `PrismStructure/data/users.js` (unique emails via timestamp/random; optional `TEST_USER_PASSWORD` / `TEST_USER_EMAIL`), `data/checkout.js` (COD sample address TG + `1234AA`, invoice payload builder), and `data/products.js` (search keywords). API helpers select product/cart/invoice IDs from live responses.

### Validation Notes

Live checkout/API work confirmed TG + `1234AA` as a working billing combination for COD. Tokens and IDs are runtime-only.

### Changes I Made

- Added/updated `PrismStructure/data/users.js`, `checkout.js`, `products.js`
- QA engineer decision: use assessment sample billing address for COD paths; keep secrets out of git (env overrides only)

### Reason for Changes

Isolate data from specs, avoid collisions on registration, and prevent secret/ID hardcoding.

---

## Entry

### Prompt

Review the API documentation… Do not guess undocumented fields. Report any documentation uncertainty before writing tests.

### AI Response Summary

AI reported documented endpoints/bodies/status codes for register, login, products, cart, and invoices, and explicitly flagged uncertainties (for example cart response schema documenting mainly `id`; invoice success documented as 200 while live often returns 201; some error shapes undocumented).

### Validation Notes

QA engineer then instructed AI to proceed with implementation using practical resolutions rather than blocking on doc gaps (`you can write yourself`).

### Changes I Made

- No test-data file change in the docs-only step
- Later assertions accepted invoice **200 or 201** and asserted observed `cart_items` where OpenAPI was thin — **QA engineer authorized writing tests despite uncertainty**

### Reason for Changes

Honest contract review first; then engineer-approved pragmatic assertions tied to observed behavior.

# AI prompts — Test design

Prompt history for manual and automated test design. Entries reflect this Cursor conversation only.

**QA engineer decisions** are labeled separately from AI suggestions.

---

## Entry

### Prompt

Create 8 manual functional test cases for Practice Software Testing Toolshop covering registration/login, invalid login, product search, multi-product cart, quantity update, COD checkout, invoice verification, and one edge/negative checkout scenario. Use the specified CSV columns. Use Smoke or Regression tags; include positive, negative, and edge tests; leave ActualResult and Status blank.

### AI Response Summary

AI created `FunctionalTestCase.csv` with eight cases (`TC-MAN-01` … `TC-MAN-08`) mapped to UI-AC1/UI-AC2, Smoke/Regression/Edge tags, and blank ActualResult/Status.

### Validation Notes

Count stays at 8 (within 5–8). Synthetic test data patterns used (unique email placeholders, COD sample address fields).

### Changes I Made

- Added `FunctionalTestCase.csv`

### Reason for Changes

Mandatory manual suite deliverable with required CSV schema.

---

## Entry

### Prompt

Review `FunctionalTestCase.csv` against assessment requirements. Check traceability, positive/negative/edge coverage, Smoke/Regression classification, clear preconditions/expected results, duplicates/low-value cases, and the 5–8 manual limit. List problems first, then propose only necessary corrections.

### AI Response Summary

AI reviewed the CSV against assessment constraints and proposed only necessary corrections if gaps or duplicates were found (problems-first review as requested).

### Validation Notes

Suite remained at eight manual cases in the repository after this phase. ActualResult/Status stayed blank pending execution recording.

### Changes I Made

- QA engineer retained the eight-case manual suite structure in `FunctionalTestCase.csv` (any corrections applied only as needed from the review; no expansion beyond 8)

### Reason for Changes

Keep manual design compliant with assessment limits and AC traceability.

---

## Entry

### Prompt

Review the current UI suite and add only the highest-value missing scenarios while keeping the total between 5 and 8 tests. Include suitable negative or edge coverage for search, cart, or checkout. Avoid duplicating the end-to-end flow. Classify each test with `@smoke` or `@regression`.

### AI Response Summary

AI added high-value UI edge/negative coverage (empty search, empty cart blocked, single confirm does not create invoice) without cloning the COD E2E, keeping UI automation within 5–8 tests.

### Validation Notes

Final UI count in repo: **7** tests. Tags applied as `@smoke` / `@regression` per case.

### Changes I Made

- Added/updated UI specs under `PrismStructure/tests/ui/` (including search negative and cart-checkout edge specs)
- Committed on `assesment` (e.g. edge-case commit in history)

### Reason for Changes

Close coverage gaps for search/cart/checkout edges while obeying the UI test-count cap.

# AI prompts — Requirements and planning

Prompt history for Toolshop QA assessment planning. Entries are limited to prompts and outcomes that occurred in this Cursor conversation. System-only commit/push notifications are omitted.

**QA engineer decisions** are labeled as such and are distinct from AI suggestions.

---

## Entry

### Prompt

Make branch `assesment` and then commit and push the further work on the same branch. Read the attached QA Practical Assessment document. Extract: mandatory deliverables; UI and API acceptance criteria; test-count restrictions; required tools and framework; submission structure; important special instructions. Do not create code yet. Highlight ambiguous or conflicting requirements.

### AI Response Summary

AI extracted assessment content into `assessment-requirements.md`, including deliverables, UI-AC1/UI-AC2, API-AC1/API-AC2, 5–8 tests per suite, Playwright + Cursor + Prism Structure, submission tree (including `ai-prompts/`), and special rules (double confirm, iterative commits, no secrets). AI also listed ambiguities (task-management ACs vs ecommerce SUT; “all flows” vs 5–8 limit; sanity vs smoke wording).

### Validation Notes

QA engineer directed work onto branch spelling **`assesment`** (not `assessment`). No automation code was created in this step, per prompt.

### Changes I Made

- Created/updated `assessment-requirements.md`
- Used branch `assesment` for subsequent commits (QA engineer instruction)

### Reason for Changes

Capture written requirements and conflicts before design or coding.

---

## Entry

### Prompt

Analyze https://practicesoftwaretesting.com/ as a QA engineer. Identify main testable ecommerce flows (registration, login/profile, browse/search, cart/quantity, COD checkout, invoice). Categorize Smoke vs Regression; include positive, negative, and edge scenarios. Keep scope suitable for 5–8 UI automated tests.

### AI Response Summary

AI proposed a lean UI-oriented flow map with Smoke/Regression and positive/negative/edge ideas sized for the 5–8 UI limit, aligned to the live Toolshop site.

### Validation Notes

Analysis informed later risk doc and suite design; no conflicting QA engineer override recorded in-repo beyond continuing to the formal risk analysis prompt.

### Changes I Made

Planning output only in this step (no dedicated file required by this prompt alone). Later absorbed into `requirement-risk-analysis.md`.

### Reason for Changes

Risk-based scoping before writing cases or automation.

---

## Entry

### Prompt

Create a requirement and risk analysis for Practice Software Testing Toolshop. For each major flow: requirement/AC, business risk, failure impact, testing priority, recommended UI/API coverage, Smoke/Regression. Pay special attention to authentication, cart state, checkout, duplicate confirmation, and invoice generation.

### AI Response Summary

AI authored `requirement-risk-analysis.md` with P0–P2 priorities, flow tables, cross-cutting risks (auth boundary, cart–invoice consistency, unique test data, secrets), lean UI/API traceability IDs, and explicit Core out-of-scope items.

### Validation Notes

Document retained on `assesment` as a committed deliverable. Double-confirm called out as UI-specific P0.

### Changes I Made

- Added `requirement-risk-analysis.md` (committed iteratively on `assesment`)

### Reason for Changes

Satisfy assessment requirement for application-specific risk analysis and guide the lean suite.

# AI prompts — Documentation and summary

Prompt history for assessment documentation and this prompt-history capture. Entries reflect this Cursor conversation only.

**QA engineer decisions** are labeled separately from AI suggestions.

---

## Entry

### Prompt

Create `project-info.md` for the Toolshop QA assessment, including project summary, AUT, tools, scope/ACs, risk analysis, UI/API strategy, smoke/regression, coverage mix, test-data strategy, how AI was used, responsible AI/sensitive-data precautions, and reuse. Describe only work actually present in the repository.

### AI Response Summary

AI wrote root `project-info.md` from existing repo artifacts only (manual 8 / UI 7 / API 8, PrismStructure layout, risk/requirements docs, data builders, tags, secret-handling notes). Did not claim missing deliverables such as `ai-prompts/` before they existed.

### Validation Notes

Content constrained to files and counts actually in the tree at write time.

### Changes I Made

- Added `project-info.md` (committed/pushed on `assesment`)

### Reason for Changes

Mandatory assessment project write-up without inventing unfinished work.

---

## Entry

### Prompt

Create `README.md` based on the actual repository. Include overview, prerequisites, installation, secret-safe configuration, test-data location, commands for all/UI/API/Smoke/Regression, reports, structure, known behaviors including invoice double confirmation, and troubleshooting. Verify every documented command against `package.json` and Playwright configuration.

### AI Response Summary

AI created root `README.md` with commands copied from `PrismStructure/package.json`, report/project settings from `playwright.config.js`, env guidance from `.env.example`/`env.js`, known behaviors (double confirm, TG address, invoice 200/201, auth error shapes), and troubleshooting. Slimmed `PrismStructure/README.md` to a quick start linking to the root README.

### Validation Notes

Documented npm scripts match `package.json` (`test`, `test:smoke`, `test:regression`, `test:ui`, `test:api`, `test:ui:smoke`, `test:api:smoke`, `report`, `report:open`).

### Changes I Made

- Added root `README.md`
- Updated `PrismStructure/README.md`
- Committed/pushed on `assesment`

### Reason for Changes

Provide accurate runnable documentation for reviewers.

---

## Entry

### Prompt

Summarize this conversation for the appropriate `ai-prompts` markdown file. For each meaningful interaction use Entry / Prompt / AI Response Summary / Validation Notes / Changes I Made / Reason for Changes. Do not invent prompts, responses, validation, or results. Clearly distinguish AI suggestions from decisions made by the QA engineer.

### AI Response Summary

AI split the Toolshop assessment prompt history across the assessment-required `ai-prompts/` files by phase (`requirements-and-planning.md`, `test-design.md`, `test-data.md`, `automation-and-debugging.md`, `documentation-and-summary.md`), using only prompts evidenced in this conversation. Omitted unrelated earlier chat topics (e.g. Tata Play) and non-substantive system commit/notify prompts. Labeled QA engineer decisions such as branch name `assesment`, “you can write yourself,” and not inventing unfinished deliverables.

### Validation Notes

This file is part of that split. Where a full re-run after the COD harden fix was not finished in chat, that incompleteness is stated in `automation-and-debugging.md` rather than claiming all-green.

### Changes I Made

- Created `ai-prompts/` with the five assessment-mapped markdown files

### Reason for Changes

Preserve honest AI prompt history as required by the assessment submission structure.

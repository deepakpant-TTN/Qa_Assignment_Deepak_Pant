# QA Practical Assessment — Requirements Extraction

Source: `QA Practical Assessment (2).pdf`

## 1. Mandatory deliverables

- Requirement and application-specific risk analysis.
- `project-info.md` describing the project, AI-assisted QA workflow, scope, strategy, validation, test data, debugging, security considerations, and reuse.
- Manual functional test suite in CSV format.
- Playwright UI automation covering smoke and end-to-end/regression flows.
- Playwright API automation covering the core API lifecycle.
- Test-data strategy and generated test data/payloads.
- Traceability from requirements/acceptance criteria to scenarios and tests.
- Execution evidence: reports, logs, screenshots, or API evidence.
- `README.md` with setup, execution commands, test-data location, smoke/regression commands, and report location.
- Complete AI prompt history for requirements, test design, test data, automation/debugging, and documentation.
- Public Git repository URL with iterative commits.
- Final execution report showing the status of all test cases.

## 2. UI and API acceptance criteria

### UI

**UI-AC1 — Registration, login, and profile**

- Register a new user with valid details.
- Log in using the registered credentials.
- Verify the user's profile information.

**UI-AC2 — End-to-end purchase and invoice**

- Browse products.
- Add multiple products to the cart.
- Update product quantity.
- Complete checkout using Cash on Delivery.
- Press the confirmation action twice where required to generate the invoice.
- Verify the generated invoice under **My Invoices**.

The wider requested UI scope also mentions functional, negative, edge, error-handling, smoke/sanity, and regression coverage.

### API

**API-AC1 — Authentication and cart creation**

- Register a new user through the API.
- Log in with the new credentials.
- Obtain and validate a bearer token.
- Create a new cart using authenticated access.

**API-AC2 — Product selection and invoice generation**

- Retrieve products.
- Add selected products to the cart.
- Verify cart contents.
- Generate an invoice with customer, order, and Cash on Delivery details.
- Validate the invoice response and resulting state.

The example invoice payload contains billing address fields, `payment_method: "cash-on-delivery"`, `cart_id`, and an empty `payment_details` object.

## 3. Test-count restrictions

- Keep each test type to **5–8 test cases**:
  - Manual tests: 5–8
  - UI automation tests: 5–8
  - API automation tests: 5–8
- Include both `@Smoke` and `@Regression` coverage.
- The document also asks for positive, negative, edge, and functional coverage within these limits.

## 4. Required tools and framework

- Cursor AI is the required AI-assisted development tool.
- Playwright is required for UI and API automation.
- The document specifies the **Prism Framework/Prism Structure**, but does not define its source, version, or exact conventions.
- The work should remain within the Cursor monthly usage limit.
- Recommended model strategy: use Auto for most planning/documentation and reserve stronger coding models for automation and difficult debugging.

## 5. Submission structure

```text
Qa_Assignment_Deepak_Pant/
├── FunctionalTestCase.csv
├── PrismStructure/                 # Playwright UI/API tests and reports
├── project-info.md
├── README.md
├── assessment-requirements.md
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
└── .cursor/
    ├── rules/
    ├── skills/
    └── agent-or-mcp/               # Optional
```

## 6. Important special instructions

- SUT: `https://practicesoftwaretesting.com/`
- API documentation: `https://api.practicesoftwaretesting.com/api/documentation`
- Complete the exercise within one week; the Core QA project is estimated at 5–10 focused hours.
- Prioritize a clean, well-documented core scope over excessive automation.
- Categorize tests as sanity/smoke or regression.
- Press the UI confirmation action twice when invoice generation requires it.
- Use iterative development and preserve prompt history as work progresses.
- Do not push the entire assignment as a single commit.
- Submit through a public Git repository.
- Keep secrets, credentials, tokens, and unnecessary personal/customer data out of AI prompts and the repository.
- Execution reports are expected, and the document requests all test statuses to be `Passed`.

## Ambiguous or conflicting requirements

1. **E-commerce vs unrelated state-machine criteria:** The Core Acceptance Criteria mention create, list, view, update, comment, search, priorities, statuses, and invalid state transitions. These appear copied from a task-management project and do not align with the Toolshop e-commerce SUT.
2. **“All possible flows” vs 5–8 tests:** The document asks for all possible e-commerce flows while limiting each manual/UI/API suite to 5–8 cases. The practical interpretation should be risk-based coverage of key flows.
3. **Sanity vs smoke terminology:** Both terms are used without defining whether they are equivalent or separate categories.
4. **Test-count wording:** “5–8 test cases of each type (manual+UI+API)” most likely means 5–8 per suite, but it could be interpreted as 5–8 total across all suites.
5. **Prism Framework definition:** No repository, package, version, language choice, or required project template is supplied.
6. **All tests must pass:** This conflicts with realistic execution evidence when a valid test exposes a SUT defect. Failed tests should not be hidden; defects and rerun results should be documented.
7. **Invoice double confirmation:** The instruction clearly applies to the UI, but it is unclear whether the API invoice flow also requires two confirmation requests.
8. **Public repository vs test data:** The document requires a public repository but does not define approved sample data or environment credentials. Only synthetic data should be committed.
9. **Browser and environment scope:** No required browser matrix, operating system, viewport, environment, or accessibility/performance threshold is specified.
10. **Optional Cursor content:** MCP is explicitly optional, but it is unclear whether Cursor rules and skills are mandatory artifacts or merely a suggested structure.

# Requirement and Risk Analysis — Practice Software Testing Toolshop

**Application:** [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/)  
**API docs:** [https://api.practicesoftwaretesting.com/api/documentation](https://api.practicesoftwaretesting.com/api/documentation)  
**Focus:** Registration, authentication, profile, product discovery, cart, COD checkout, invoice generation/verification

## Scope and assumptions

- Customer-facing ecommerce journeys only (not admin).
- Cash on Delivery is the payment method for checkout/invoice flows.
- UI invoice generation requires **Confirm pressed twice**.
- API coverage is used to validate auth tokens, cart lifecycle, and invoice creation independently of the UI.
- Analysis is sized for a lean Core: **5–8 UI** and **5–8 API** automated tests plus matching manual cases.

## Priority legend

| Priority | Meaning |
|----------|---------|
| P0 | Blocks purchase or account access; must be in Smoke |
| P1 | High business impact; core Regression |
| P2 | Important quality/validation; Regression if capacity allows |

## Flow analysis

### 1. User registration

| Field | Detail |
|-------|--------|
| Requirement / AC | A new user can register with valid mandatory details and unique email, then access authenticated areas. |
| Business risk | Fake/duplicate accounts, weak validation, incomplete profile data carried into checkout. |
| Failure impact | Users cannot start purchase; support load increases; downstream checkout/invoice may fail with incomplete customer data. |
| Testing priority | **P0** |
| Recommended coverage | **UI:** happy-path registration. **API:** register endpoint success + duplicate email/invalid payload negatives. |
| Classification | **Smoke** (valid registration). **Regression** (missing fields, malformed email, duplicate email). |

### 2. Login and session

| Field | Detail |
|-------|--------|
| Requirement / AC | Registered users can log in with valid credentials, receive a valid session/token, and remain authenticated for protected actions. |
| Business risk | Broken auth blocks revenue; weak auth allows unauthorized cart/invoice access. |
| Failure impact | Login failures stop all authenticated flows; token issues can expose carts/invoices or cause intermittent checkout failures. |
| Testing priority | **P0** |
| Recommended coverage | **UI:** valid login. **API:** login → bearer token obtain/validate. Both: invalid credentials and unauthorized access checks. |
| Classification | **Smoke** (valid login + token). **Regression** (wrong password, unknown email, blank fields, expired/invalid token). |

### 3. Profile verification

| Field | Detail |
|-------|--------|
| Requirement / AC | After login, the user can view profile details matching registration data (name, email, address fields used later in billing). |
| Business risk | Incorrect profile data leads to wrong invoices/shipping and chargebacks/support disputes. |
| Failure impact | Billing/invoice mismatch; failed COD fulfillment; loss of trust. |
| Testing priority | **P1** |
| Recommended coverage | **UI:** profile page assertions after registration/login. **API:** user/profile retrieval after auth (if exposed). |
| Classification | **Smoke** (profile readable after login). **Regression** (field persistence after update, empty optional fields). |

### 4. Product browsing and search

| Field | Detail |
|-------|--------|
| Requirement / AC | Users can browse the catalogue, search by keyword, open product details, and see accurate name, price, and availability. |
| Business risk | Wrong products/prices enter the cart and invoice; empty search results confuse users. |
| Failure impact | Abandoned carts, incorrect order value, support disputes. |
| Testing priority | **P1** |
| Recommended coverage | **UI:** browse + search + product detail. **API:** product list/retrieve for cart seeding and price assertions. |
| Classification | **Smoke** (find and open a known-available product). **Regression** (no-results search, category filter edge cases). |

### 5. Cart creation and quantity updates

| Field | Detail |
|-------|--------|
| Requirement / AC | Users can add multiple products, update quantities, remove items, and see correct line totals and cart total. Cart state remains consistent across page navigations. |
| Business risk | Stale cart state, incorrect totals, lost items — highest pre-checkout integrity risk. |
| Failure impact | Wrong COD amount, failed checkout, customer complaints, revenue leakage. |
| Testing priority | **P0** |
| Recommended coverage | **UI:** multi-item add, quantity increase/decrease, total recalculation. **API:** create cart, add products, verify cart contents. |
| Classification | **Smoke** (create cart + add items + verify contents/totals). **Regression** (qty=0/remove, max qty edge, concurrent update/stale state). |

### 6. Checkout using Cash on Delivery

| Field | Detail |
|-------|--------|
| Requirement / AC | Authenticated user with a non-empty cart can complete checkout with billing details and `payment_method = cash-on-delivery`. |
| Business risk | Checkout abandonment; payment method mismatch; orders created without required address fields. |
| Failure impact | Lost sales; unfulfillable COD orders; inventory/order inconsistency. |
| Testing priority | **P0** |
| Recommended coverage | **UI:** full COD checkout path. **API:** invoice/order create with COD payload and required billing fields. |
| Classification | **Smoke** (happy-path COD). **Regression** (missing billing fields, empty cart checkout, invalid cart_id). |

### 7. Duplicate confirmation (UI-specific)

| Field | Detail |
|-------|--------|
| Requirement / AC | On UI checkout, user must press **Confirm twice** to generate the invoice. Single confirm must not finalize the order. |
| Business risk | Accidental double-submit vs incomplete confirm — both can create wrong order counts or blocked invoice generation. |
| Failure impact | Missing invoices, duplicate invoices/orders, flaky automation if only one confirm is sent. |
| Testing priority | **P0** |
| Recommended coverage | **UI-only:** assert one confirm does not complete; two confirms create invoice. Document API behavior separately (API may not require double confirm). |
| Classification | **Smoke** (two confirms → invoice). **Regression** (single confirm remains pending; rapid double-click does not create duplicates unexpectedly). |

### 8. Invoice generation and verification

| Field | Detail |
|-------|--------|
| Requirement / AC | After successful COD checkout, an invoice is generated and visible under **My Invoices**, matching cart products, quantities, totals, address, and payment method. |
| Business risk | Invoice is the customer proof of purchase and fulfillment trigger — highest post-checkout risk. |
| Failure impact | Customer cannot prove order; support escalation; revenue/reporting mismatch; legal/compliance exposure. |
| Testing priority | **P0** |
| Recommended coverage | **UI:** My Invoices list + invoice detail verification. **API:** generate invoice with sample billing payload and verify response/cart linkage. |
| Classification | **Smoke** (invoice created and visible with correct key fields). **Regression** (unauthorized invoice access, empty cart invoice attempt, field-level mismatches). |

## Cross-cutting risks

| Area | Risk | Priority | Coverage |
|------|------|----------|----------|
| Authentication boundary | Protected cart/checkout/invoice endpoints usable without token | P0 | API negative unauthorized tests |
| Cart–invoice consistency | Invoice products/totals differ from final cart | P0 | UI E2E + API cart verify before invoice |
| Test data uniqueness | Reused emails/cart IDs cause false failures | P1 | Unique registration data per run |
| Environment inventory | Product out of stock breaks Smoke | P1 | Dynamic product selection via API |
| Sensitive data | Real PII/tokens in prompts/repo | P0 process | Synthetic data only |

## Traceability to lean automation suite (recommended)

| ID | Flow | Type | Suite | Priority |
|----|------|------|-------|----------|
| UI-01 | Registration success | Positive / Smoke | UI | P0 |
| UI-02 | Login + profile | Positive / Smoke | UI | P0 |
| UI-03 | Browse + search | Positive / Smoke | UI | P1 |
| UI-04 | Cart + quantity update | Positive / Smoke | UI | P0 |
| UI-05 | COD checkout + double confirm + invoice | Positive / Smoke E2E | UI | P0 |
| UI-06 | Registration validation | Negative / Regression | UI | P1 |
| UI-07 | Invalid login | Negative / Regression | UI | P1 |
| UI-08 | Search empty + cart edge | Edge / Regression | UI | P2 |
| API-01 | Register + login + token | Positive / Smoke | API | P0 |
| API-02 | Create cart (authenticated) | Positive / Smoke | API | P0 |
| API-03 | Products + add to cart + verify | Positive / Smoke | API | P0 |
| API-04 | Generate COD invoice | Positive / Smoke | API | P0 |
| API-05 | Invalid login / unauthorized | Negative / Regression | API | P1 |
| API-06 | Duplicate email / invalid register | Negative / Regression | API | P1 |
| API-07 | Invoice with invalid/empty cart | Negative / Regression | API | P1 |
| API-08 | Cart quantity edge / verify totals | Edge / Regression | API | P2 |

## Special attention summary

1. **Authentication:** Gate for cart, checkout, and invoices; validate both UI session and API bearer token.
2. **Cart state:** Treat cart as shared mutable state; assert contents and totals before and after quantity changes.
3. **Checkout (COD):** Validate billing payload completeness and payment method mapping.
4. **Duplicate confirmation:** Explicit UI gate; automate and document the two-step confirm; do not assume API needs the same.
5. **Invoice generation:** End-state proof of purchase; verify identity, line items, totals, address, and COD method under My Invoices / API response.

## Out of scope for Core (documented risks, not automated now)

- Admin catalogue/pricing management
- Non-COD payment methods beyond existence checks
- Performance, accessibility, and multi-browser matrix
- Wishlist/favorites, contact form, multi-language (unless needed for Smoke stability)

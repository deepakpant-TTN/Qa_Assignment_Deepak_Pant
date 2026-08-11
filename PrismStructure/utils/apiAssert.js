const { expect } = require('@playwright/test');

/**
 * Shared API response assertions used by lifecycle and focused specs.
 */
async function expectJsonStatus(response, expectedStatus) {
  const statuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
  expect(statuses, `Unexpected status ${response.status()}`).toContain(response.status());
  return response.json();
}

function expectNonEmptyString(value, fieldName) {
  expect(value, `${fieldName} should be a non-empty string`).toEqual(expect.any(String));
  expect(String(value).length, `${fieldName} should not be empty`).toBeGreaterThan(0);
}

function expectPositiveNumber(value, fieldName) {
  expect(typeof value, `${fieldName} should be a number`).toBe('number');
  expect(value, `${fieldName} should be >= 0`).toBeGreaterThanOrEqual(0);
}

/**
 * Validates documented Product schema fields on a product object.
 * @param {object} product
 */
function expectProductSchema(product) {
  expect(product).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
    })
  );
  expectNonEmptyString(product.id, 'product.id');
  expectNonEmptyString(product.name, 'product.name');
}

/**
 * Validates login token payload.
 * @param {object} body
 * @param {string} token
 */
function expectLoginTokenSchema(body, token) {
  expectNonEmptyString(token, 'access_token');
  expect(body.access_token).toBe(token);
  expectNonEmptyString(body.token_type, 'token_type');
}

/**
 * Validates cart contents against dynamically selected product rows.
 * OpenAPI documents cart.id; cart_items is observed at runtime.
 * @param {object} cart
 * @param {string} cartId
 * @param {{ productId: string, quantity: number }[]} expectedItems
 */
function expectCartContents(cart, cartId, expectedItems) {
  expect(cart.id).toBe(cartId);
  expect(Array.isArray(cart.cart_items)).toBeTruthy();
  expect(cart.cart_items.length).toBeGreaterThanOrEqual(expectedItems.length);

  for (const expected of expectedItems) {
    const match = cart.cart_items.find((item) => item.product_id === expected.productId);
    expect(match, `Missing cart item for product ${expected.productId}`).toBeTruthy();
    expect(match.quantity).toBe(expected.quantity);
  }
}

/**
 * Validates COD invoice create response values against the request payload.
 * @param {object} invoice
 * @param {object} requestPayload
 */
function expectCodInvoiceSchema(invoice, requestPayload) {
  expectNonEmptyString(invoice.id, 'invoice.id');
  expectNonEmptyString(invoice.invoice_number, 'invoice.invoice_number');
  expect(invoice.invoice_number).toMatch(/^INV-/);

  expect(invoice.billing_street).toBe(requestPayload.billing_street);
  expect(invoice.billing_city).toBe(requestPayload.billing_city);
  expect(invoice.billing_state).toBe(requestPayload.billing_state);
  expect(invoice.billing_country).toBe(requestPayload.billing_country);
  expect(invoice.billing_postal_code).toBe(requestPayload.billing_postal_code);

  if (invoice.cart_id !== undefined) {
    expect(invoice.cart_id).toBe(requestPayload.cart_id);
  }
  if (invoice.payment_method !== undefined) {
    expect(invoice.payment_method).toBe('cash-on-delivery');
  }

  expectPositiveNumber(invoice.subtotal ?? 0, 'invoice.subtotal');
  expectPositiveNumber(invoice.total ?? 0, 'invoice.total');
}

module.exports = {
  expectJsonStatus,
  expectNonEmptyString,
  expectPositiveNumber,
  expectProductSchema,
  expectLoginTokenSchema,
  expectCartContents,
  expectCodInvoiceSchema,
};

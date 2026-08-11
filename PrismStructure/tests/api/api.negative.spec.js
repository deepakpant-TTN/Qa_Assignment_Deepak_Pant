const { test, expect } = require('../../fixtures/testFixtures');
const { ToolshopLifecycle } = require('../../api/ToolshopLifecycle');
const { buildCodInvoicePayload, codAddress } = require('../../data/checkout');
const {
  expectErrorStatus,
  expectUnauthorizedMessage,
  expectNotFoundMessage,
  expectValidationFieldError,
} = require('../../utils/apiAssert');

test.describe('API negative paths @regression', () => {
  test('rejects invoice create with missing or invalid bearer token @regression', async ({
    apiClient,
    authApi,
    productApi,
    cartApi,
    invoiceApi,
  }) => {
    const lifecycle = new ToolshopLifecycle({ authApi, productApi, cartApi, invoiceApi });
    const products = await lifecycle.retrieveProducts(1);
    const { cartId } = await lifecycle.createCart();
    await lifecycle.addSelectedProducts(cartId, products, [1]);
    const payload = buildCodInvoicePayload(cartId);

    // Missing bearer — observed: 401 + { message: "Unauthorized" }
    apiClient.setToken(null);
    const missingAuth = await invoiceApi.createInvoice(payload);
    const missingBody = await expectErrorStatus(missingAuth, 401);
    expectUnauthorizedMessage(missingBody);

    // Invalid bearer — observed: 401 + { message: "Unauthorized" }
    apiClient.setToken('invalid.bearer.token');
    const invalidAuth = await invoiceApi.createInvoice(payload);
    const invalidBody = await expectErrorStatus(invalidAuth, 401);
    expectUnauthorizedMessage(invalidBody);
  });

  test('returns not-found for invalid product and cart IDs @regression', async ({
    productApi,
    cartApi,
  }) => {
    const unknownProductId = `01unknownproduct${Date.now()}`;
    const unknownCartId = `01unknowncart${Date.now()}`;

    // Observed: GET /products/{id} → 404 + { message: "Requested item not found" }
    const productResponse = await productApi.getProduct(unknownProductId);
    const productBody = await expectErrorStatus(productResponse, 404);
    expectNotFoundMessage(productBody);

    // Observed: GET /carts/{id} → 404 + { message: "Requested item not found" }
    const cartResponse = await cartApi.getCart(unknownCartId);
    const cartBody = await expectErrorStatus(cartResponse, 404);
    expectNotFoundMessage(cartBody);
  });

  test('rejects invalid product_id when adding to a cart @regression', async ({ cartApi }) => {
    const createResponse = await cartApi.createCart();
    expect(createResponse.status()).toBe(201);
    const { id: cartId } = await createResponse.json();

    // Observed: POST /carts/{id} with bad product_id → 422 + product_id validation errors
    const addResponse = await cartApi.addProduct(cartId, `01invalidproduct${Date.now()}`, 1);
    const body = await expectErrorStatus(addResponse, 422);
    expect(body.message).toMatch(/product id is invalid/i);
    expectValidationFieldError(body, 'product_id', /invalid/i);
  });

  test('rejects invoice payloads with missing fields or invalid values @regression', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
  }) => {
    const lifecycle = new ToolshopLifecycle({ authApi, productApi, cartApi, invoiceApi });
    const { user } = await lifecycle.registerUniqueUser();
    await lifecycle.loginAndExtractToken(user);
    const products = await lifecycle.retrieveProducts(1);
    const { cartId } = await lifecycle.createCart();
    await lifecycle.addSelectedProducts(cartId, products, [1]);

    // Observed: missing cart_id → 422 + { cart_id: ["The cart id field is required."] }
    const missingCartIdPayload = {
      billing_street: codAddress.street,
      billing_city: codAddress.city,
      billing_state: codAddress.state,
      billing_country: codAddress.countryCode,
      billing_postal_code: codAddress.postalCode,
      payment_method: 'cash-on-delivery',
      payment_details: {},
    };
    const missingCartIdResponse = await invoiceApi.createInvoice(missingCartIdPayload);
    const missingCartIdBody = await expectErrorStatus(missingCartIdResponse, 422);
    expectValidationFieldError(missingCartIdBody, 'cart_id', /required/i);

    // Observed: missing billing_street → 422 + billing_street required
    const missingStreetPayload = {
      ...buildCodInvoicePayload(cartId),
    };
    delete missingStreetPayload.billing_street;
    const missingStreetResponse = await invoiceApi.createInvoice(missingStreetPayload);
    const missingStreetBody = await expectErrorStatus(missingStreetResponse, 422);
    expectValidationFieldError(missingStreetBody, 'billing_street', /required/i);

    // Observed: invalid payment_method → 422 + payment_method invalid
    const invalidMethodPayload = {
      ...buildCodInvoicePayload(cartId),
      payment_method: 'not-a-valid-method',
    };
    const invalidMethodResponse = await invoiceApi.createInvoice(invalidMethodPayload);
    const invalidMethodBody = await expectErrorStatus(invalidMethodResponse, 422);
    expectValidationFieldError(invalidMethodBody, 'payment_method', /invalid/i);

    // Observed: unknown cart_id → 404 + { message: "Requested item not found" }
    const unknownCartPayload = buildCodInvoicePayload(`01unknowncart${Date.now()}`);
    const unknownCartResponse = await invoiceApi.createInvoice(unknownCartPayload);
    const unknownCartBody = await expectErrorStatus(unknownCartResponse, 404);
    expectNotFoundMessage(unknownCartBody);
  });
});

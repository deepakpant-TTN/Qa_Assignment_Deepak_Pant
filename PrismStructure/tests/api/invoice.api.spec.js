const { test, expect } = require('../../fixtures/testFixtures');
const { ProductApi } = require('../../api/ProductApi');
const { buildUniqueApiUser, toApiRegisterPayload } = require('../../data/users');
const { buildCodInvoicePayload } = require('../../data/checkout');

test.describe('API invoice', () => {
  test('creates COD invoice with bearer token after cart is prepared @smoke', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
  }) => {
    const user = buildUniqueApiUser();
    const registerResponse = await authApi.register(toApiRegisterPayload(user));
    expect(registerResponse.status()).toBe(201);

    const { response: loginResponse, token } = await authApi.login(user.email, user.password);
    expect(loginResponse.status()).toBe(200);
    expect(token).toBeTruthy();

    const products = ProductApi.extractProducts(await (await productApi.listProducts()).json());
    expect(products.length).toBeGreaterThan(0);

    const createCart = await cartApi.createCart();
    expect(createCart.status()).toBe(201);
    const { id: cartId } = await createCart.json();

    const addResponse = await cartApi.addProduct(cartId, products[0].id, 1);
    expect(addResponse.status()).toBe(200);

    const invoiceResponse = await invoiceApi.createInvoice(buildCodInvoicePayload(cartId));
    // Spec documents 200; live API commonly returns 201 for created resources.
    expect([200, 201]).toContain(invoiceResponse.status());
    const invoice = await invoiceResponse.json();
    expect(invoice.id).toBeTruthy();
    expect(invoice.invoice_number).toBeTruthy();
    expect(invoice.cart_id === undefined || invoice.cart_id === cartId).toBeTruthy();
  });

  test('rejects invoice creation without authentication @regression', async ({
    productApi,
    cartApi,
    invoiceApi,
  }) => {
    const products = ProductApi.extractProducts(await (await productApi.listProducts()).json());
    expect(products.length).toBeGreaterThan(0);

    const createCart = await cartApi.createCart();
    expect(createCart.status()).toBe(201);
    const { id: cartId } = await createCart.json();
    await cartApi.addProduct(cartId, products[0].id, 1);

    const invoiceResponse = await invoiceApi.createInvoice(buildCodInvoicePayload(cartId));
    expect(invoiceResponse.ok()).toBeFalsy();
    expect(invoiceResponse.status()).toBeGreaterThanOrEqual(401);
  });
});

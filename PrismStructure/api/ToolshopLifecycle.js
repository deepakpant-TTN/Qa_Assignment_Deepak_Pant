const { expect } = require('@playwright/test');
const { ProductApi } = require('./ProductApi');
const { buildUniqueApiUser, toApiRegisterPayload } = require('../data/users');
const { buildCodInvoicePayload, codAddress } = require('../data/checkout');
const {
  expectJsonStatus,
  expectLoginTokenSchema,
  expectProductSchema,
  expectCartContents,
  expectCodInvoiceSchema,
} = require('../utils/apiAssert');

/**
 * Reusable Toolshop API lifecycle steps — no hardcoded IDs or tokens.
 */
class ToolshopLifecycle {
  /**
   * @param {{ authApi: import('./AuthApi').AuthApi, productApi: import('./ProductApi').ProductApi, cartApi: import('./CartApi').CartApi, invoiceApi: import('./InvoiceApi').InvoiceApi }} apis
   */
  constructor({ authApi, productApi, cartApi, invoiceApi }) {
    this.authApi = authApi;
    this.productApi = productApi;
    this.cartApi = cartApi;
    this.invoiceApi = invoiceApi;
  }

  /**
   * Step 1 — Register a unique user for this test run.
   */
  async registerUniqueUser(user = buildUniqueApiUser()) {
    const payload = toApiRegisterPayload(user);
    const response = await this.authApi.register(payload);
    const body = await expectJsonStatus(response, 201);
    return { user, payload, registered: body, userId: body.id };
  }

  /**
   * Step 2 — Log in and capture the bearer token (also set on ApiClient).
   */
  async loginAndExtractToken(user) {
    const { response, body, token } = await this.authApi.login(user.email, user.password);
    // AuthApi.login already consumes the JSON body once.
    expect(response.status()).toBe(200);
    expectLoginTokenSchema(body, token);
    return { token, loginBody: body };
  }

  /**
   * Step 3 — Retrieve products and return dynamic product IDs.
   * @param {number} count
   */
  async retrieveProducts(count = 2) {
    const response = await this.productApi.listProducts();
    const body = await expectJsonStatus(response, 200);
    const products = ProductApi.extractProducts(body);
    expect(products.length).toBeGreaterThanOrEqual(count);

    const selected = products.slice(0, count);
    selected.forEach(expectProductSchema);
    return selected;
  }

  /**
   * Step 4 — Create a cart; returns dynamic cart ID.
   */
  async createCart() {
    const response = await this.cartApi.createCart();
    const body = await expectJsonStatus(response, 201);
    expect(body.id).toEqual(expect.any(String));
    expect(body.id.length).toBeGreaterThan(0);
    return { cartId: body.id, created: body };
  }

  /**
   * Step 5 — Add selected products to the cart.
   * @param {string} cartId
   * @param {{ id: string }[]} products
   * @param {number[]} [quantities]
   */
  async addSelectedProducts(cartId, products, quantities) {
    const selections = products.map((product, index) => ({
      productId: product.id,
      quantity: quantities?.[index] ?? index + 1,
    }));

    for (const item of selections) {
      const response = await this.cartApi.addProduct(cartId, item.productId, item.quantity);
      const body = await expectJsonStatus(response, 200);
      expect(body.result).toBe('item added or updated');
    }

    return selections;
  }

  /**
   * Step 6 — Verify cart contents for the dynamically chosen products.
   * @param {string} cartId
   * @param {{ productId: string, quantity: number }[]} expectedItems
   */
  async verifyCartContents(cartId, expectedItems) {
    const response = await this.cartApi.getCart(cartId);
    const cart = await expectJsonStatus(response, 200);
    expectCartContents(cart, cartId, expectedItems);
    return cart;
  }

  /**
   * Steps 7–8 — Generate COD invoice and validate response schema/values.
   * @param {string} cartId
   * @param {object} [address]
   */
  async generateAndValidateCodInvoice(cartId, address = codAddress) {
    const payload = buildCodInvoicePayload(cartId, address);
    const response = await this.invoiceApi.createInvoice(payload);
    // Spec documents 200; live API commonly returns 201.
    const invoice = await expectJsonStatus(response, [200, 201]);
    expectCodInvoiceSchema(invoice, payload);
    return { invoice, payload };
  }
}

module.exports = { ToolshopLifecycle };

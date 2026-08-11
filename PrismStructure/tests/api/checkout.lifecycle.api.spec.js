const { test, expect } = require('../../fixtures/testFixtures');
const { ToolshopLifecycle } = require('../../api/ToolshopLifecycle');
const { expectNonEmptyString } = require('../../utils/apiAssert');

test.describe('API Toolshop lifecycle @smoke', () => {
  test('register → login → products → cart → COD invoice @smoke', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
  }) => {
    const lifecycle = new ToolshopLifecycle({ authApi, productApi, cartApi, invoiceApi });

    // 1. Register a unique user
    const { user, registered, userId } = await lifecycle.registerUniqueUser();
    expect(registered.email).toBe(user.email);
    expectNonEmptyString(userId, 'registered.userId');

    // 2. Log in and extract bearer token
    const { token } = await lifecycle.loginAndExtractToken(user);
    expectNonEmptyString(token, 'bearer token');

    // 3. Retrieve products (dynamic IDs)
    const products = await lifecycle.retrieveProducts(2);

    // 4. Create a cart (dynamic cart ID)
    const { cartId } = await lifecycle.createCart();

    // 5. Add selected products
    const selections = await lifecycle.addSelectedProducts(cartId, products, [1, 2]);

    // 6. Verify cart contents
    const cart = await lifecycle.verifyCartContents(cartId, selections);
    expect(cart.cart_items.length).toBeGreaterThanOrEqual(2);

    // 7–8. Generate COD invoice and validate response
    const { invoice, payload } = await lifecycle.generateAndValidateCodInvoice(cartId);
    expect(invoice.billing_street).toBe(payload.billing_street);
    expectNonEmptyString(invoice.id, 'invoice.id');
    expectNonEmptyString(invoice.invoice_number, 'invoice.invoice_number');
  });
});

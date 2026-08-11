const { test, expect } = require('../../fixtures/testFixtures');
const { ToolshopLifecycle } = require('../../api/ToolshopLifecycle');
const { buildCodInvoicePayload, codAddress } = require('../../data/checkout');

test.describe('API invoice @regression', () => {
  test('rejects COD invoice creation without authentication @regression', async ({
    productApi,
    cartApi,
    invoiceApi,
    authApi,
  }) => {
    const lifecycle = new ToolshopLifecycle({ authApi, productApi, cartApi, invoiceApi });
    const products = await lifecycle.retrieveProducts(1);
    const { cartId } = await lifecycle.createCart();
    await lifecycle.addSelectedProducts(cartId, products, [1]);

    const invoiceResponse = await invoiceApi.createInvoice(buildCodInvoicePayload(cartId));
    expect(invoiceResponse.ok()).toBeFalsy();
    expect(invoiceResponse.status()).toBeGreaterThanOrEqual(401);
  });

  test('rejects COD invoice when required cart_id is missing @regression', async ({
    authApi,
    productApi,
    cartApi,
    invoiceApi,
  }) => {
    const lifecycle = new ToolshopLifecycle({ authApi, productApi, cartApi, invoiceApi });
    const { user } = await lifecycle.registerUniqueUser();
    await lifecycle.loginAndExtractToken(user);

    const incompletePayload = {
      billing_street: codAddress.street,
      billing_city: codAddress.city,
      billing_state: codAddress.state,
      billing_country: codAddress.countryCode,
      billing_postal_code: codAddress.postalCode,
      payment_method: 'cash-on-delivery',
      payment_details: {},
    };

    const invoiceResponse = await invoiceApi.createInvoice(incompletePayload);
    expect(invoiceResponse.ok()).toBeFalsy();
    expect(invoiceResponse.status()).toBeGreaterThanOrEqual(400);
  });
});

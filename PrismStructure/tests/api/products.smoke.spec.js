const { test, expect } = require('../../fixtures/testFixtures');
const { ProductApi } = require('../../api/ProductApi');
const { expectJsonStatus, expectProductSchema } = require('../../utils/apiAssert');

test.describe('API products @smoke', () => {
  test('lists products with documented product fields @smoke', async ({ productApi }) => {
    const response = await productApi.listProducts();
    const body = await expectJsonStatus(response, 200);
    const products = ProductApi.extractProducts(body);
    expect(products.length).toBeGreaterThan(0);
    expectProductSchema(products[0]);
  });
});

const { test, expect } = require('../../fixtures/testFixtures');
const { ProductApi } = require('../../api/ProductApi');

test.describe('API products @smoke', () => {
  test('lists products with documented product fields @smoke', async ({ productApi }) => {
    const response = await productApi.listProducts();
    expect(response.status()).toBe(200);
    const body = await response.json();
    const products = ProductApi.extractProducts(body);
    expect(products.length).toBeGreaterThan(0);

    const product = products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(typeof product.price).toBe('number');
  });

  test('returns a single product by id @smoke', async ({ productApi }) => {
    const listResponse = await productApi.listProducts();
    expect(listResponse.ok()).toBeTruthy();
    const products = ProductApi.extractProducts(await listResponse.json());
    expect(products.length).toBeGreaterThan(0);

    const productId = products[0].id;
    const detailResponse = await productApi.getProduct(productId);
    expect(detailResponse.status()).toBe(200);
    const product = await detailResponse.json();
    expect(product.id).toBe(productId);
    expect(product.name).toBeTruthy();
  });
});

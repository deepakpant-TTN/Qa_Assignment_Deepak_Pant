const { test, expect } = require('../../fixtures/testFixtures');

test.describe('API framework smoke @smoke', () => {
  test('products endpoint responds from configured API_BASE_URL @smoke', async ({ productApi }) => {
    const response = await productApi.listProducts();
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toBeTruthy();
  });
});

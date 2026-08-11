const { test, expect } = require('../../fixtures/testFixtures');
const { productSearch } = require('../../data/products');

test.describe('Product search UI', () => {
  test('invalid search shows empty results @regression', async ({ homePage, page }) => {
    await homePage.open();
    await homePage.searchExpectingNoResults(productSearch.invalidKeyword);

    await expect(page.getByText(`0 products found for '${productSearch.invalidKeyword}'`)).toBeVisible();
    await expect(page.getByText('There are no products found.')).toBeVisible();
    await expect(homePage.productNames).toHaveCount(0);
  });
});

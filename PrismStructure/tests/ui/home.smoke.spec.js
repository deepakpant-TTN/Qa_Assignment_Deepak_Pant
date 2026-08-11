const { test, expect } = require('../../fixtures/testFixtures');

test.describe('UI framework smoke @smoke', () => {
  test('home page is reachable via configured UI_BASE_URL @smoke', async ({ homePage, page }) => {
    await homePage.open();
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveURL(/practicesoftwaretesting\.com|localhost/);
  });
});

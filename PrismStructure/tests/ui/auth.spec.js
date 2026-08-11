const { test, expect } = require('../../fixtures/testFixtures');
const { buildUniqueUser } = require('../../data/users');

test.describe('Authentication UI', () => {
  test('successful registration and login @smoke', async ({ page, registerPage, loginPage }) => {
    const user = buildUniqueUser();

    await registerPage.open();
    await registerPage.register(user);
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.open();
    await loginPage.login(user.email, user.password);

    await expect(page).toHaveURL(/\/account/);
    await expect(loginPage.navMenu).toBeVisible();
    await expect(loginPage.navMenu).toContainText(`${user.firstName} ${user.lastName}`);
    await expect(loginPage.navSignIn).toHaveCount(0);
  });

  test('invalid login shows validation error @regression', async ({ page, registerPage, loginPage }) => {
    const user = buildUniqueUser();

    await registerPage.open();
    await registerPage.register(user);
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.open();
    await loginPage.login(user.email, 'WrongPass@999');

    await expect(loginPage.errorMessage.first()).toBeVisible();
    await expect(loginPage.errorMessage.first()).toHaveText(/invalid email or password/i);
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(loginPage.navSignIn).toBeVisible();
    await expect(loginPage.navMenu).toHaveCount(0);
  });
});

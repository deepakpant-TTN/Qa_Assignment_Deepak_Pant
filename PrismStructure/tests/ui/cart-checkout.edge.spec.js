const { test, expect } = require('../../fixtures/testFixtures');
const { buildUniqueUser } = require('../../data/users');
const { codAddress } = require('../../data/checkout');

test.describe('Cart and checkout edge UI', () => {
  test('empty cart cannot proceed to checkout @regression', async ({ page, cartPage }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/checkout/);
    await expect(cartPage.productTitles).toHaveCount(0);
    await expect(cartPage.proceedButton).toHaveCount(0);
  });

  test('single confirm does not create an invoice @regression', async ({
    page,
    registerPage,
    loginPage,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
    invoicesPage,
  }) => {
    test.setTimeout(90_000);
    const user = buildUniqueUser();
    user.street = codAddress.street;
    user.city = codAddress.city;
    user.state = codAddress.state;
    user.countryCode = codAddress.countryCode;
    user.postalCode = codAddress.postalCode;
    user.houseNumber = codAddress.houseNumber;

    await registerPage.open();
    await registerPage.register(user);
    await expect(page).toHaveURL(/\/auth\/login/);

    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await expect(page).toHaveURL(/\/account/);

    await homePage.open();
    await homePage.openProductByIndex(0);
    await productPage.addToCart();
    await homePage.openCart();
    await cartPage.waitForItems();
    await cartPage.proceedToSignInStep();
    await checkoutPage.proceedAsLoggedInUser();
    await checkoutPage.fillBillingDetails(codAddress);
    await checkoutPage.proceedToPayment();
    await checkoutPage.selectCashOnDelivery();

    await checkoutPage.confirmButton.click();
    await expect(checkoutPage.paymentSuccess).toBeVisible();

    await invoicesPage.openFromMenu();
    await expect(page).toHaveURL(/\/account\/invoices/);
    await expect(invoicesPage.invoiceRows).toHaveCount(0);
  });
});

const { test, expect } = require('../../fixtures/testFixtures');
const { buildUniqueUser } = require('../../data/users');
const { codAddress } = require('../../data/checkout');
const { productSearch } = require('../../data/products');

test.describe('Purchase E2E UI', () => {
  test('COD checkout with quantity update and invoice verification @smoke @regression', async ({
    page,
    registerPage,
    loginPage,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
    invoicesPage,
  }) => {
    test.setTimeout(120_000);
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
    await expect(loginPage.navMenu).toContainText(`${user.firstName} ${user.lastName}`);

    const selectedProducts = [];
    for (let index = 0; index < 2; index += 1) {
      await homePage.open();
      await homePage.searchExpectingResults(productSearch.validKeyword);
      await homePage.openProductByIndex(index);
      const name = await productPage.getName();
      const unitPrice = await productPage.getUnitPrice();
      selectedProducts.push({ name, unitPrice });
      await productPage.addToCart();
    }

    await homePage.openCart();
    await expect(page).toHaveURL(/\/checkout/);
    await cartPage.waitForItems();

    const titles = await cartPage.getProductTitles();
    expect(titles).toEqual(expect.arrayContaining(selectedProducts.map((item) => item.name)));

    await cartPage.updateQuantity(0, 2);
    await expect(cartPage.linePrices.first()).toContainText('$');
    const linePrices = await cartPage.getLinePrices();
    const cartTotal = await cartPage.getCartTotal();
    expect(linePrices.length).toBeGreaterThanOrEqual(2);
    expect(cartTotal).toMatch(/\$\d+\.\d{2}/);

    await cartPage.proceedToSignInStep();
    await checkoutPage.proceedAsLoggedInUser();
    await checkoutPage.fillBillingDetails(codAddress);
    await checkoutPage.proceedToPayment();
    await checkoutPage.selectCashOnDelivery();

    const invoice = await checkoutPage.confirmTwiceAndCreateInvoice();
    expect(invoice.invoice_number).toMatch(/^INV-/i);
    expect(Number(invoice.total)).toBeGreaterThan(0);

    await invoicesPage.openFromMenu();
    await invoicesPage.waitForInvoiceList();
    const invoicePageText = await invoicesPage.getVisibleText();
    expect(invoicePageText).toContain(invoice.invoice_number);
    expect(invoicePageText).toContain(codAddress.street);
  });
});

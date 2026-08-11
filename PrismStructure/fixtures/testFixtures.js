const base = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage } = require('../pages/LoginPage');
const { ProductPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { ProfilePage } = require('../pages/ProfilePage');
const { InvoicesPage } = require('../pages/InvoicesPage');
const { ApiClient } = require('../api/ApiClient');
const { AuthApi } = require('../api/AuthApi');
const { ProductApi } = require('../api/ProductApi');
const { CartApi } = require('../api/CartApi');
const { InvoiceApi } = require('../api/InvoiceApi');

const test = base.test.extend({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  invoicesPage: async ({ page }, use) => {
    await use(new InvoicesPage(page));
  },
  apiClient: async ({}, use) => {
    const client = await ApiClient.create();
    await use(client);
    await client.dispose();
  },
  authApi: async ({ apiClient }, use) => {
    await use(new AuthApi(apiClient));
  },
  productApi: async ({ apiClient }, use) => {
    await use(new ProductApi(apiClient));
  },
  cartApi: async ({ apiClient }, use) => {
    await use(new CartApi(apiClient));
  },
  invoiceApi: async ({ apiClient }, use) => {
    await use(new InvoiceApi(apiClient));
  },
});

module.exports = { test, expect: base.expect };

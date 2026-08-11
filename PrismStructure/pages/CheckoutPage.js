const { BasePage } = require('./BasePage');
const { expect } = require('@playwright/test');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.proceedSignedIn = page.getByTestId('proceed-2');
    this.proceedBilling = page.getByTestId('proceed-3');
    this.country = page.getByTestId('country');
    this.postalCode = page.getByTestId('postal_code');
    this.houseNumber = page.getByTestId('house_number');
    this.street = page.getByTestId('street');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.paymentMethod = page.getByTestId('payment-method');
    this.confirmButton = page.getByTestId('finish');
    this.paymentSuccess = page.getByText('Payment was successful');
  }

  async proceedAsLoggedInUser() {
    await this.proceedSignedIn.waitFor({ state: 'visible' });
    await this.proceedSignedIn.click();
  }

  /**
   * @param {import('../data/checkout').CheckoutAddress} address
   */
  async fillBillingDetails(address) {
    await this.country.selectOption(address.countryCode);
    await this.postalCode.fill(address.postalCode);
    await this.street.fill(address.street);
    await this.city.fill(address.city);
    await this.state.fill(address.state);
    // Country/postal changes can trigger address-form updates. Fill the required
    // house number last so those updates cannot clear it afterward.
    await this.houseNumber.fill(address.houseNumber || '42');
    await this.houseNumber.press('Tab');

    await expect(this.houseNumber).toHaveValue(address.houseNumber || '42');
    await expect(this.proceedBilling).toBeEnabled();
  }

  async proceedToPayment() {
    await this.proceedBilling.click();
    await this.paymentMethod.waitFor({ state: 'visible' });
  }

  async selectCashOnDelivery() {
    await this.paymentMethod.selectOption('cash-on-delivery');
    await this.confirmButton.waitFor({ state: 'visible' });
  }

  /**
   * Toolshop requires Confirm twice:
   * 1) payment validation -> "Payment was successful"
   * 2) invoice creation -> POST /invoices
   */
  async confirmTwiceAndCreateInvoice() {
    await this.confirmButton.click();
    await this.paymentSuccess.waitFor({ state: 'visible' });

    const invoiceResponsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes('/invoices') &&
        response.request().method() === 'POST'
    );

    await this.confirmButton.click();
    const invoiceResponse = await invoiceResponsePromise;
    const bodyText = await invoiceResponse.text();
    if (!invoiceResponse.ok()) {
      throw new Error(`Invoice create failed (${invoiceResponse.status()}): ${bodyText}`);
    }

    const invoice = JSON.parse(bodyText);
    if (!invoice.invoice_number) {
      throw new Error(`Invoice response missing invoice_number: ${bodyText}`);
    }
    return invoice;
  }
}

module.exports = { CheckoutPage };

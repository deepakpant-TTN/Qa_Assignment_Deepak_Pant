const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.paymentMethod = page.locator('[data-test="payment-method"]').or(page.getByLabel(/payment/i));
    this.confirmButton = page.locator('[data-test="finish"]').or(page.getByRole('button', { name: /confirm|finish|place order/i }));
    this.successMessage = page.locator('[data-test="payment-success-message"]').or(page.getByText(/payment|invoice|success/i));
  }

  /**
   * @param {import('../data/checkout').CheckoutAddress} address
   */
  async fillBillingDetails(address) {
    const fields = [
      ['street', address.street],
      ['city', address.city],
      ['state', address.state],
      ['country', address.country],
      ['postal_code', address.postalCode],
    ];

    for (const [name, value] of fields) {
      const field = this.page.locator(`[data-test="${name}"]`).or(this.page.getByLabel(new RegExp(name.replace('_', ' '), 'i')));
      if (await field.count()) {
        const tag = await field.first().evaluate((el) => el.tagName.toLowerCase());
        if (tag === 'select') {
          await field.first().selectOption({ label: value }).catch(async () => {
            await field.first().selectOption({ value });
          });
        } else {
          await field.first().fill(value);
        }
      }
    }
  }

  async selectCashOnDelivery() {
    const select = this.paymentMethod.first();
    if (await select.count()) {
      await select.selectOption({ label: /cash on delivery/i }).catch(async () => {
        await select.selectOption('cash-on-delivery');
      });
    } else {
      await this.page.getByText(/cash on delivery/i).click();
    }
  }

  /**
   * Toolshop requires Confirm twice for invoice generation.
   */
  async confirmTwice() {
    await this.confirmButton.first().click();
    await this.confirmButton.first().click();
  }
}

module.exports = { CheckoutPage };

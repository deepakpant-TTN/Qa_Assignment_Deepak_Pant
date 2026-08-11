const { BasePage } = require('./BasePage');

class InvoicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.invoicesNav = page.locator('[data-test="nav-my-invoices"]').or(page.getByRole('link', { name: /invoices/i }));
    this.invoiceRows = page.locator('[data-test="invoice-number"], table tbody tr');
  }

  async open() {
    await this.invoicesNav.first().click().catch(async () => {
      await this.goto('/account/invoices');
    });
  }

  async openLatestInvoice() {
    await this.invoiceRows.first().click();
  }
}

module.exports = { InvoicesPage };

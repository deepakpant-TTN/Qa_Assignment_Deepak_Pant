const { BasePage } = require('./BasePage');

class InvoicesPage extends BasePage {
  constructor(page) {
    super(page);
    this.navMenu = page.getByTestId('nav-menu');
    this.myInvoicesLink = page.getByTestId('nav-my-invoices');
    this.invoiceRows = page.locator('table tbody tr');
    this.invoiceNumbers = page.locator('table tbody tr td').first();
  }

  async openFromMenu() {
    await this.navMenu.click();
    await this.myInvoicesLink.click();
    await this.page.waitForURL(/\/account\/invoices/);
  }

  async waitForInvoiceList() {
    await this.invoiceRows.first().waitFor({ state: 'visible' });
  }

  async getVisibleText() {
    return this.page.locator('body').innerText();
  }

  async openLatestInvoice() {
    await this.invoiceRows.first().locator('a').first().click().catch(async () => {
      await this.invoiceRows.first().click();
    });
  }
}

module.exports = { InvoicesPage };

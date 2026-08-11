const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.productTitles = page.getByTestId('product-title');
    this.quantityInputs = page.getByTestId('product-quantity');
    this.unitPrices = page.getByTestId('product-price');
    this.linePrices = page.getByTestId('line-price');
    this.cartTotal = page.getByTestId('cart-total');
    this.proceedButton = page.getByTestId('proceed-1');
  }

  async waitForItems() {
    await this.productTitles.first().waitFor({ state: 'visible' });
  }

  async getProductTitles() {
    const titles = await this.productTitles.allTextContents();
    return titles.map((title) => title.trim());
  }

  async updateQuantity(index, quantity) {
    const input = this.quantityInputs.nth(index);
    await input.fill(String(quantity));
    await input.press('Tab');
  }

  async getLinePrices() {
    return (await this.linePrices.allTextContents()).map((value) => value.trim());
  }

  async getCartTotal() {
    return (await this.cartTotal.textContent()).trim();
  }

  async proceedToSignInStep() {
    await this.proceedButton.click();
  }
}

module.exports = { CartPage };

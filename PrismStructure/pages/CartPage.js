const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartRows = page.locator('[data-test="cart-item"], tbody tr');
    this.proceedButton = page.locator('[data-test="proceed-1"]').or(page.getByRole('button', { name: /proceed/i }));
    this.quantityInputs = page.locator('[data-test="product-quantity"], input[type="number"]');
    this.cartTotal = page.locator('[data-test="cart-total"]').or(page.getByText(/total/i));
  }

  async open() {
    await this.goto('/checkout');
  }

  async updateFirstItemQuantity(quantity) {
    await this.quantityInputs.first().fill(String(quantity));
    await this.quantityInputs.first().blur();
  }

  async proceedToCheckout() {
    await this.proceedButton.first().click();
  }
}

module.exports = { CartPage };

const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName = page.locator('[data-test="product-name"]').or(page.locator('h1'));
    this.productPrice = page.locator('[data-test="unit-price"]').or(page.locator('.price'));
    this.addToCartButton = page.locator('[data-test="add-to-cart"]').or(page.getByRole('button', { name: /add to cart/i }));
    this.quantityInput = page.locator('[data-test="quantity"]').or(page.getByLabel(/quantity/i));
  }

  async addToCart(quantity = 1) {
    if (quantity > 1 && (await this.quantityInput.count())) {
      await this.quantityInput.fill(String(quantity));
    }
    await this.addToCartButton.click();
  }

  async getName() {
    return (await this.productName.first().textContent())?.trim();
  }
}

module.exports = { ProductPage };

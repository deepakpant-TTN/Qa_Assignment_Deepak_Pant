const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.addedToast = page.getByText('Product added to shopping cart.');
    this.navCart = page.getByTestId('nav-cart');
  }

  async getName() {
    return (await this.productName.textContent()).trim();
  }

  async getUnitPrice() {
    return (await this.unitPrice.textContent()).trim();
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.addedToast.waitFor({ state: 'visible' });
    await this.navCart.waitFor({ state: 'visible' });
  }
}

module.exports = { ProductPage };

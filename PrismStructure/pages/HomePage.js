const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchButton = page.getByTestId('search-submit');
    this.productNames = page.getByTestId('product-name');
    this.navCart = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  async open() {
    await this.goto('/');
    await this.productNames.first().waitFor({ state: 'visible' });
  }

  async search(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  async searchExpectingResults(keyword) {
    await this.search(keyword);
    await this.productNames.first().waitFor({ state: 'visible' });
  }

  async searchExpectingNoResults(keyword) {
    await this.search(keyword);
    await this.page.getByText(/0 products found|there are no products found/i).first().waitFor({
      state: 'visible',
    });
  }

  async openProductByIndex(index = 0) {
    await this.productNames.nth(index).click();
  }

  async openCart() {
    await this.navCart.click();
  }
}

module.exports = { HomePage };

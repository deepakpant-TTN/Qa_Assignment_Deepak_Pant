const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.getByPlaceholder(/search/i).or(page.locator('[data-test="search-query"]'));
    this.searchButton = page.locator('[data-test="search-submit"]').or(page.getByRole('button', { name: /search/i }));
    this.productCards = page.locator('[data-test="product-name"], .card');
    this.navSignIn = page.getByRole('link', { name: /sign in/i }).or(page.locator('[data-test="nav-sign-in"]'));
  }

  async open() {
    await this.goto('/');
  }

  async search(keyword) {
    await this.searchInput.first().fill(keyword);
    await this.searchButton.first().click();
  }

  async openFirstProduct() {
    await this.productCards.first().click();
  }
}

module.exports = { HomePage };

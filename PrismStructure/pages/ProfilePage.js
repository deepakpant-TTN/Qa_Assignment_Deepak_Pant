const { BasePage } = require('./BasePage');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.profileNav = page.locator('[data-test="nav-profile"]').or(page.getByRole('link', { name: /profile|my account/i }));
    this.email = page.locator('[data-test="email"]').or(page.getByText(/@/));
  }

  async open() {
    await this.profileNav.first().click().catch(async () => {
      await this.goto('/account/profile');
    });
  }
}

module.exports = { ProfilePage };

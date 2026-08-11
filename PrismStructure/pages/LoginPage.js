const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.email = page.locator('[data-test="email"]').or(page.getByLabel(/email/i));
    this.password = page.locator('[data-test="password"]').or(page.getByLabel(/password/i));
    this.loginButton = page.locator('[data-test="login-submit"]').or(page.getByRole('button', { name: /login|sign in/i }));
    this.errorMessage = page.locator('[data-test="login-error"]').or(page.getByRole('alert'));
  }

  async open() {
    await this.goto('/auth/login');
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };

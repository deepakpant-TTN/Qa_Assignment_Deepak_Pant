const { BasePage } = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-submit');
    this.errorMessage = page.getByText(/invalid email or password/i);
    this.navMenu = page.getByTestId('nav-menu');
    this.navSignIn = page.getByTestId('nav-sign-in');
  }

  async open() {
    await this.goto('/auth/login');
    await this.email.waitFor({ state: 'visible' });
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };

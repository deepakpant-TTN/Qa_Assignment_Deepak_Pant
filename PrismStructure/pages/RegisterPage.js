const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = page.locator('[data-test="first-name"]').or(page.getByLabel(/first name/i));
    this.lastName = page.locator('[data-test="last-name"]').or(page.getByLabel(/last name/i));
    this.dob = page.locator('[data-test="dob"]').or(page.getByLabel(/date of birth/i));
    this.street = page.locator('[data-test="street"]').or(page.getByLabel(/street/i));
    this.postalCode = page.locator('[data-test="postal_code"]').or(page.getByLabel(/postal/i));
    this.city = page.locator('[data-test="city"]').or(page.getByLabel(/city/i));
    this.state = page.locator('[data-test="state"]').or(page.getByLabel(/state/i));
    this.country = page.locator('[data-test="country"]').or(page.getByLabel(/country/i));
    this.phone = page.locator('[data-test="phone"]').or(page.getByLabel(/phone/i));
    this.email = page.locator('[data-test="email"]').or(page.getByLabel(/email/i));
    this.password = page.locator('[data-test="password"]').or(page.getByLabel(/^password$/i));
    this.registerButton = page.locator('[data-test="register-submit"]').or(page.getByRole('button', { name: /register/i }));
  }

  async open() {
    await this.goto('/auth/register');
  }

  /**
   * @param {import('../data/users').UserProfile} user
   */
  async register(user) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    if (user.dob) await this.dob.fill(user.dob);
    await this.street.fill(user.street);
    await this.postalCode.fill(user.postalCode);
    await this.city.fill(user.city);
    await this.state.fill(user.state);
    await this.country.selectOption({ label: user.country }).catch(async () => {
      await this.country.fill(user.country);
    });
    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };

const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.dob = page.getByTestId('dob');
    this.street = page.getByTestId('street');
    this.postalCode = page.getByTestId('postal_code');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.country = page.getByTestId('country');
    this.houseNumber = page.getByTestId('house_number');
    this.phone = page.getByTestId('phone');
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.registerButton = page.getByTestId('register-submit');
  }

  async open() {
    await this.goto('/auth/register');
    await this.firstName.waitFor({ state: 'visible' });
  }

  /**
   * @param {import('../data/users').UserProfile} user
   */
  async register(user) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.dob.fill(user.dob);
    await this.street.fill(user.street);
    await this.postalCode.fill(user.postalCode);
    await this.city.fill(user.city);
    await this.state.fill(user.state);
    await this.country.selectOption(user.countryCode || user.country);
    if (await this.houseNumber.count()) {
      await this.houseNumber.fill(user.houseNumber || '42');
    }
    await this.phone.fill(user.phone);
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.registerButton.click();
  }
}

module.exports = { RegisterPage };

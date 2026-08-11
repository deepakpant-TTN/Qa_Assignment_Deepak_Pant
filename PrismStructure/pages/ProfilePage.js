const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
    this.profileNav = page.getByTestId('nav-profile');
    this.firstName = page.getByTestId('first-name');
    this.lastName = page.getByTestId('last-name');
    this.email = page.getByTestId('email');
    this.phone = page.getByTestId('phone');
    this.street = page.getByTestId('street');
    this.postalCode = page.getByTestId('postal_code');
    this.city = page.getByTestId('city');
    this.state = page.getByTestId('state');
    this.country = page.getByTestId('country');
  }

  async open() {
    if (await this.profileNav.count()) {
      await this.profileNav.click();
    } else {
      await this.goto('/account/profile');
    }
    await expect(this.page).toHaveURL(/\/account\/profile/);
    await this.email.waitFor({ state: 'visible' });
    await expect(this.email).not.toHaveValue('');
  }

  /**
   * Asserts profile fields match the registered user (UI-AC1).
   * @param {import('../data/users').UserProfile} user
   */
  async expectProfileMatches(user) {
    await expect(this.firstName).toHaveValue(user.firstName);
    await expect(this.lastName).toHaveValue(user.lastName);
    await expect(this.email).toHaveValue(user.email);
    await expect(this.phone).toHaveValue(user.phone);
    await expect(this.street).toHaveValue(user.street);
    await expect(this.postalCode).toHaveValue(user.postalCode);
    await expect(this.city).toHaveValue(user.city);
    await expect(this.state).toHaveValue(user.state);
    await expect(this.country).toHaveValue(user.countryCode || user.country);
  }
}

module.exports = { ProfilePage };

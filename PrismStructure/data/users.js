/**
 * @typedef {Object} UserProfile
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} dob
 * @property {string} street
 * @property {string} postalCode
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} countryCode
 * @property {string} houseNumber
 * @property {string} phone
 * @property {string} email
 * @property {string} password
 */

function uniqueEmail(prefix = 'qa.toolshop') {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 10000)}@example.com`;
}

/**
 * Builds a unique registrable user at runtime.
 * Password can be overridden via TEST_USER_PASSWORD; never commit secrets.
 * @returns {UserProfile}
 */
function buildUniqueUser() {
  const password = process.env.TEST_USER_PASSWORD || 'ValidPass@123';
  return {
    firstName: 'Deepak',
    lastName: 'Pant',
    dob: '1990-01-15',
    street: '12 Test Street',
    postalCode: '1234AA',
    city: 'Testville',
    state: 'Florida',
    country: 'United States of America',
    countryCode: 'US',
    houseNumber: '42',
    phone: '5555555555',
    email: uniqueEmail(),
    password,
  };
}

/**
 * Optional pre-existing user from environment — never hardcode secrets in tests.
 */
function getConfiguredUser() {
  const email = process.env.TEST_USER_EMAIL;
  const password = process.env.TEST_USER_PASSWORD;
  if (!email || !password) {
    return null;
  }
  return { email, password };
}

/**
 * API-friendly user using TG + 1234AA (known-valid for invoice billing).
 * @returns {UserProfile}
 */
function buildUniqueApiUser() {
  return {
    ...buildUniqueUser(),
    street: 'Zoey Shore',
    city: 'Hesselbury',
    state: 'Florida',
    country: 'Togo',
    countryCode: 'TG',
    postalCode: '1234AA',
    houseNumber: '42',
  };
}

/**
 * API registration payload mapping for Toolshop.
 * @param {UserProfile} user
 */
function toApiRegisterPayload(user) {
  return {
    first_name: user.firstName,
    last_name: user.lastName,
    dob: user.dob,
    address: {
      street: user.street,
      house_number: user.houseNumber || undefined,
      city: user.city,
      state: user.state,
      country: user.countryCode || user.country,
      postal_code: user.postalCode,
    },
    phone: user.phone,
    email: user.email,
    password: user.password,
  };
}

module.exports = {
  uniqueEmail,
  buildUniqueUser,
  buildUniqueApiUser,
  getConfiguredUser,
  toApiRegisterPayload,
};

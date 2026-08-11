/**
 * @typedef {Object} UserProfile
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} [dob]
 * @property {string} street
 * @property {string} postalCode
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} phone
 * @property {string} email
 * @property {string} password
 */

function uniqueEmail(prefix = 'qa.toolshop') {
  const stamp = Date.now();
  return `${prefix}.${stamp}@example.com`;
}

/**
 * Builds a unique registrable user. Password comes from env when provided.
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
    country: 'Albania',
    phone: '1234567890',
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
      city: user.city,
      state: user.state,
      country: user.country,
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
  getConfiguredUser,
  toApiRegisterPayload,
};

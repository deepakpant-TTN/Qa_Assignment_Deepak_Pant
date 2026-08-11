/**
 * @typedef {Object} CheckoutAddress
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} country
 * @property {string} postalCode
 */

const codAddress = {
  street: 'Zoey Shore',
  city: 'Hesselbury',
  state: 'Florida',
  country: 'TG',
  postalCode: '1234AA',
};

/**
 * @param {string} cartId
 */
function buildCodInvoicePayload(cartId, address = codAddress) {
  return {
    billing_street: address.street,
    billing_city: address.city,
    billing_state: address.state,
    billing_country: address.country,
    billing_postal_code: address.postalCode,
    payment_method: 'cash-on-delivery',
    cart_id: cartId,
    payment_details: {},
  };
}

module.exports = {
  codAddress,
  buildCodInvoicePayload,
};

/**
 * @typedef {Object} CheckoutAddress
 * @property {string} street
 * @property {string} city
 * @property {string} state
 * @property {string} countryCode
 * @property {string} postalCode
 * @property {string} [houseNumber]
 */

/**
 * Assessment sample address. Country TG validates with postal format 1234AA.
 */
const codAddress = {
  street: 'Zoey Shore',
  city: 'Hesselbury',
  state: 'Florida',
  countryCode: 'TG',
  postalCode: '1234AA',
  houseNumber: '42',
};

/**
 * @param {string} cartId
 * @param {CheckoutAddress} [address]
 */
function buildCodInvoicePayload(cartId, address = codAddress) {
  return {
    billing_street: address.street,
    billing_city: address.city,
    billing_state: address.state,
    billing_country: address.countryCode,
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

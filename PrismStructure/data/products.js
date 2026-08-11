/**
 * Product search/test data kept outside specs.
 */
const productSearch = {
  validKeyword: process.env.PRODUCT_SEARCH_KEYWORD || 'pliers',
  exactKeyword: process.env.PRODUCT_EXACT_KEYWORD || 'Combination Pliers',
  invalidKeyword: process.env.PRODUCT_INVALID_KEYWORD || 'xqvznonexistent999',
};

module.exports = {
  productSearch,
};

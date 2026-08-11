/**
 * Product search/test data kept outside specs.
 * Prefer resolving live product IDs via ProductApi during tests.
 */
const productSearch = {
  validKeyword: process.env.PRODUCT_SEARCH_KEYWORD || 'pliers',
  invalidKeyword: 'zzznoproductxyz999',
};

module.exports = {
  productSearch,
};

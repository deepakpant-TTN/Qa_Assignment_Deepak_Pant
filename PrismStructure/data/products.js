/**
 * Product search/test data kept outside specs.
 */
const productSearch = {
  validKeyword: process.env.PRODUCT_SEARCH_KEYWORD || 'pliers',
  invalidKeyword: 'zzznoproductxyz999',
};

module.exports = {
  productSearch,
};

class ProductApi {
  /**
   * @param {import('./ApiClient').ApiClient} client
   */
  constructor(client) {
    this.client = client;
  }

  async listProducts(params = {}) {
    return this.client.get('/products', { params });
  }

  async searchProducts(query) {
    return this.client.get('/products/search', { params: { q: query } });
  }

  async getProduct(productId) {
    return this.client.get(`/products/${productId}`);
  }

  /**
   * @param {object} listBody
   * @returns {object[]}
   */
  static extractProducts(listBody) {
    if (Array.isArray(listBody)) {
      return listBody;
    }
    if (Array.isArray(listBody?.data)) {
      return listBody.data;
    }
    return [];
  }
}

module.exports = { ProductApi };

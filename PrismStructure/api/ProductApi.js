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

  async getProduct(productId) {
    return this.client.get(`/products/${productId}`);
  }
}

module.exports = { ProductApi };

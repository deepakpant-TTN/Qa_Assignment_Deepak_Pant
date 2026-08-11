class CartApi {
  /**
   * @param {import('./ApiClient').ApiClient} client
   */
  constructor(client) {
    this.client = client;
  }

  async createCart() {
    return this.client.post('/carts');
  }

  async getCart(cartId) {
    return this.client.get(`/carts/${cartId}`);
  }

  async addProduct(cartId, productId, quantity = 1) {
    return this.client.post(`/carts/${cartId}`, {
      product_id: productId,
      quantity,
    });
  }

  async updateQuantity(cartId, productId, quantity) {
    return this.client.put(`/carts/${cartId}/product/quantity`, {
      product_id: productId,
      quantity,
    });
  }
}

module.exports = { CartApi };

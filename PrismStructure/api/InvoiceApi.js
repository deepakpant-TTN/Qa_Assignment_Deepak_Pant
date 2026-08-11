class InvoiceApi {
  /**
   * @param {import('./ApiClient').ApiClient} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * @param {object} payload COD invoice payload including cart_id and billing fields
   */
  async createInvoice(payload) {
    return this.client.post('/invoices', payload);
  }

  async getInvoice(invoiceId) {
    return this.client.get(`/invoices/${invoiceId}`);
  }
}

module.exports = { InvoiceApi };

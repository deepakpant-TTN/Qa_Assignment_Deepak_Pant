class AuthApi {
  /**
   * @param {import('./ApiClient').ApiClient} client
   */
  constructor(client) {
    this.client = client;
  }

  async register(userPayload) {
    return this.client.post('/users/register', userPayload);
  }

  async login(email, password) {
    const response = await this.client.post('/users/login', { email, password });
    const body = await response.json().catch(() => ({}));
    const token = body.access_token || body.token;
    if (token) {
      this.client.setToken(token);
    }
    return { response, body, token };
  }
}

module.exports = { AuthApi };

const { request } = require('@playwright/test');
const { env } = require('../utils/env');

class ApiClient {
  /**
   * @param {import('@playwright/test').APIRequestContext} [context]
   */
  constructor(context) {
    this.context = context;
    this.token = null;
  }

  static async create() {
    const context = await request.newContext({
      baseURL: env.apiBaseUrl,
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return new ApiClient(context);
  }

  setToken(token) {
    this.token = token;
  }

  authHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  async get(path, options = {}) {
    return this.context.get(path, {
      ...options,
      headers: { ...this.authHeaders(), ...(options.headers || {}) },
    });
  }

  async post(path, data, options = {}) {
    const requestOptions = {
      ...options,
      headers: { ...this.authHeaders(), ...(options.headers || {}) },
    };
    if (data !== undefined) {
      requestOptions.data = data;
    }
    return this.context.post(path, requestOptions);
  }

  async put(path, data, options = {}) {
    return this.context.put(path, {
      data,
      ...options,
      headers: { ...this.authHeaders(), ...(options.headers || {}) },
    });
  }

  async dispose() {
    await this.context.dispose();
  }
}

module.exports = { ApiClient };

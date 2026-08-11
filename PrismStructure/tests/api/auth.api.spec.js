const { test, expect } = require('../../fixtures/testFixtures');
const { buildUniqueApiUser, toApiRegisterPayload } = require('../../data/users');

test.describe('API auth', () => {
  test('registers a user then returns bearer token on login @smoke', async ({ authApi }) => {
    const user = buildUniqueApiUser();
    const registerResponse = await authApi.register(toApiRegisterPayload(user));
    expect(registerResponse.status()).toBe(201);
    const registered = await registerResponse.json();
    expect(registered.email).toBe(user.email);
    expect(registered.id).toBeTruthy();

    const { response, body, token } = await authApi.login(user.email, user.password);
    expect(response.status()).toBe(200);
    expect(token).toBeTruthy();
    expect(body.access_token).toBe(token);
    expect(body.token_type).toBeTruthy();
  });

  test('rejects login with invalid credentials @regression', async ({ authApi }) => {
    const { response, token } = await authApi.login(
      `missing.${Date.now()}@example.com`,
      'WrongPass@999'
    );
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(token).toBeFalsy();
  });

  test('rejects duplicate email registration @regression', async ({ authApi }) => {
    const user = buildUniqueApiUser();
    const payload = toApiRegisterPayload(user);

    const first = await authApi.register(payload);
    expect(first.status()).toBe(201);

    const duplicate = await authApi.register(payload);
    expect(duplicate.ok()).toBeFalsy();
    expect(duplicate.status()).toBeGreaterThanOrEqual(400);
  });
});

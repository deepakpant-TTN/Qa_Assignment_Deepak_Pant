const { test, expect } = require('../../fixtures/testFixtures');
const { buildUniqueApiUser, toApiRegisterPayload } = require('../../data/users');
const { expectJsonStatus, expectLoginTokenSchema } = require('../../utils/apiAssert');

test.describe('API auth', () => {
  test('registers a unique user and returns a bearer token on login @smoke', async ({ authApi }) => {
    const user = buildUniqueApiUser();
    const registerResponse = await authApi.register(toApiRegisterPayload(user));
    const registered = await expectJsonStatus(registerResponse, 201);
    expect(registered.email).toBe(user.email);
    expect(registered.id).toEqual(expect.any(String));

    const { response, body, token } = await authApi.login(user.email, user.password);
    expect(response.status()).toBe(200);
    expectLoginTokenSchema(body, token);
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
    await expectJsonStatus(first, 201);

    const duplicate = await authApi.register(payload);
    expect(duplicate.ok()).toBeFalsy();
    expect(duplicate.status()).toBeGreaterThanOrEqual(400);
  });
});

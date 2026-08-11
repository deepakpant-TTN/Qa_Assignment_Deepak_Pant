const { test, expect } = require('../../fixtures/testFixtures');
const { buildUniqueApiUser, toApiRegisterPayload } = require('../../data/users');
const {
  expectJsonStatus,
  expectLoginTokenSchema,
  expectUnauthorizedLoginError,
} = require('../../utils/apiAssert');

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
    const { response, body, token } = await authApi.login(
      `missing.${Date.now()}@example.com`,
      'WrongPass@999'
    );
    // Observed live behavior: 401 + { error: "Unauthorized" }
    expect(response.status()).toBe(401);
    expectUnauthorizedLoginError(body);
    expect(token).toBeFalsy();
  });
});

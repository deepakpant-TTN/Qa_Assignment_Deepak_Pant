/**
 * Central environment config.
 * Override via process environment variables. Do not commit secrets.
 */
function requiredHint(name, fallback) {
  return process.env[name] || fallback;
}

const env = {
  uiBaseUrl: requiredHint('UI_BASE_URL', 'https://practicesoftwaretesting.com'),
  apiBaseUrl: requiredHint('API_BASE_URL', 'https://api.practicesoftwaretesting.com'),
  defaultTimeoutMs: Number(process.env.DEFAULT_TIMEOUT_MS || 30_000),
};

module.exports = { env };

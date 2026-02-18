#!/usr/bin/env node

/**
 * Checks if the IMC_API_KEY environment variable is set.
 * Runs on session start to warn users about missing configuration.
 */

const apiKey = process.env.IMC_API_KEY

if (!apiKey) {
  console.warn(
    '[Invoice My Clients] Warning: IMC_API_KEY environment variable is not set.\n' +
      'Invoice My Clients tools will not work without an API key.\n' +
      'Generate one at: https://app.invoicemyclients.com/settings/developer\n' +
      'Then set IMC_API_KEY in your environment or .env file.',
  )
  process.exit(1)
}

if (!apiKey.startsWith('imc_live_')) {
  console.warn(
    '[Invoice My Clients] Warning: IMC_API_KEY does not have the expected prefix.\n' +
      "API keys should start with 'imc_live_'.",
  )
  process.exit(1)
}

console.log(
  '[Invoice My Clients] API key configured. Ready to use invoice tools.',
)
process.exit(0)

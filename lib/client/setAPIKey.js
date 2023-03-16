const options = require('../options.js')

exports.required = ['apiKey']

// Docs
/**
 * 🔑 Sign in with an API key.
 * @category Client
 * @alias setAPIKey
 * @param {string} apiKey - The api key to sign in with.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * noblox.setAPIKey("A3H+1rfQj0Kwz0CsSO2ciuT/e/ZHekahvehGG3PPmFOASZx1")
**/

exports.func = function (args) {
  options.jar.apiKey = args.apiKey
}

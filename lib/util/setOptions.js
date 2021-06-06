// Includes
const options = require('../options.js')

// Args
exports.required = ['option', 'value']

// Docs
/**
 * Sets noblox.js options. Settings.json replacement.
 * @category Utility
 * @alias setOptions
 * @param {string} option - The settings.json equivalent to push the option to.
 * @param {(Boolean | String | Number | Object)} value - The value of the option.
 * @returns {(true | false)}
 * @example const noblox = require("noblox.js")
 * noblox.setOptions("session_only", true)
**/

exports.func = function (args) {
  options.settings[args.option] = args.value
  if (options.settings[args.option] === args.value) return true
  if (!options.settings[args.option] === args.value) return false
}

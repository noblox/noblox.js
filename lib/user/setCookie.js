const options = require('../options.js')
const getCurrentUser = require('../util/getCurrentUser.js').func

exports.required = ['cookie']
exports.optional = ['validate']

// Docs
/**
 * 🔑 Sign in with a cookie.
 * @category User
 * @alias setCookie
 * @param {string} cookie - The cookie to sign in with.
 * @param {boolean=} [validate=true] - Whether to validate the cookie or not.
 * @returns {Promise<LoggedInUserData>}
 * @example const noblox = require("noblox.js")
 * noblox.setCookie("cookie").then(function() {
 *   //your code here
 * })
**/

exports.func = function (args) {
  // verify it
  if (!args.cookie.toLowerCase().includes('warning:-')) {
    console.error('Warning: No Roblox warning detected in provided cookie. Ensure you include the entire .ROBLOSECURITY warning.')
  }
  if (args.validate === false) {
    options.jar.session = args.cookie
    return false
  } else {
    return getCurrentUser({ jar: { session: args.cookie } })
      .then(function (res) {
        options.jar.session = args.cookie
        return res
      }).catch(function (e) {
        console.error('Failed to validate cookie: Are you sure the cookie is valid?\nEnsure you include the full cookie, including warning text.')
        throw new Error(e)
      })
  }
}

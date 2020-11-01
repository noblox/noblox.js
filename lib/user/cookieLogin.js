// Allows user to login with a cookie.json, bypassing the username/password captcha issues.
// Includes
const relog = require('../util/relog.js')
// Args
exports.required = ['cookie']
exports.optional = []
let interval
const day = 86400000

// Docs
/**
 * Refresh and login using the provided cookie.
 * @category User
 * @deprecated
 * @alias cookieLogin
 * @param {string} cookie - The .ROBLOSECURITY cookie for the bot.
 * @returns {Promise<LoggedInUserData>}
 * @example const noblox = require("noblox.js")
 * noblox.cookieLogin("secretcookie")
**/

exports.func = function (args) {
  // Run relog
  console.warn('Noblox - The use of cookieLogin is deprecated: Please make use of the new methods setCookie & refreshCookie.')
  return relog(args.cookie)
    .then(function (r) {
      // Start interval
      if (!interval) {
        setInterval(relog, day)
      }
      return r
    })
}

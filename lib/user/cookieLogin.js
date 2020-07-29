// Allows user to login with a cookie.json, bypassing the username/password captcha issues.
// Includes
const relog = require('../util/relog.js')
// Args
exports.required = ['cookie']
exports.optional = []
let interval
const day = 86400000
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

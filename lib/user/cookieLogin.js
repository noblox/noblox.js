// Allows user to login with a cookie.json, bypassing the username/password captcha issues.
// Includes
var relog = require('../util/relog.js')
// Args
exports.required = ['cookie']
exports.optional = []
var interval
var day = 86400000
exports.func = function (args) {
  // Run relog
  return relog(args)
    .then(function (r) {
      // Start interval
      if (!interval) {
        setInterval(relog, day, args)
      }
      return r
    })
}

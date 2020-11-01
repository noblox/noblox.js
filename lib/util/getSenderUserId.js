// Includes
const getCurrentUser = require('./getCurrentUser.js').func
const getHash = require('./getHash.js').func
const cache = require('../cache')

// Args
exports.optional = ['jar']

// Docs
/**
 * Get the userId of the current user and cache it.
 * @category Utility
 * @alias getSenderUserId
 * @param {CookieJar=} jar - The CookieJar containing the .ROBLOSECURITY cookie.
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie.
 * const userId = await noblox.getSenderUserId()
**/

// Define
exports.func = function (args) {
  const jar = args.jar
  return cache.wrap('SenderID', getHash({ jar: jar }), function () {
    return getCurrentUser({ jar: jar })
      .then(function (info) {
        return info.UserID
      })
  })
}

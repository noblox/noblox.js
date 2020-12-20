// Dependencies
const crypto = require('crypto')

// Includes
const getSession = require('./getSession.js').func

// Args
exports.optional = ['jar']

// Docs
/**
 * Get a unique hash for the given jar. Used to cache items that depend on session.
 * @category Utility
 * @alias getHash
 * @param {CookieJar} jar - The audit log action row.
 * @returns {string}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie.
 * const hash = noblox.getHash()
**/

// Define
exports.func = function (args) {
  const session = getSession({ jar: args.jar })
  return crypto.createHash('md5').update(session).digest('hex')
}

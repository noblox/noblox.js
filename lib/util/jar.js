// Dependencies
const util = require('util')
const request = util.promisify(require('postman-request'))

// Includes
const settings = require('../../settings.json')

// Docs
/**
 * ✅ Create a jar file based on sessionOnly.
 * @category Utility
 * @alias jar
 * @param {boolean=} sessionOnly - The session to use to create the jar file.
 * @returns {CookieJar}
 * @example const noblox = require("noblox.js")
 * const jar = noblox.jar()
**/

// Define
exports.func = function (sessionOnly) {
  if (!sessionOnly) {
    sessionOnly = settings.session_only
  }
  return (sessionOnly ? { session: '' } : request.jar())
}

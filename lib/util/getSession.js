// Includes
const settings = require('../../settings.json')
const options = require('../options.js')

// Args
exports.optional = ['jar']

// Docs
/**
 * Get the .ROBLOSECURITY cookie from the jar.
 * @category Utility
 * @alias getSession
 * @param {CookieJar=} jar - The cookie jar containing the .ROBLOSECURITY cookie.
 * @returns {string}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie.
 * const cookie = await noblox.getSession()
**/

// Define
exports.func = function (args) {
  const jar = args.jar || options.jar
  if (settings.session_only) {
    return jar.session
  } else {
    const cookies = jar.getCookies('https://roblox.com')
    for (let i = 0; i < cookies.length; i++) {
      const element = cookies[i]
      if (element.key === '.ROBLOSECURITY') {
        return element.value
      }
    }
    return ''
  }
}

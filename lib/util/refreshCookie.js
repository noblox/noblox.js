// Includes
const options = require('../options.js')
const getGeneralToken = require('./getGeneralToken.js').func
const http = require('./http.js').func
// Args
exports.required = []
exports.optional = ['cookie']

// Docs
/**
 * Refreshes the stored cookie, stores it, and returns it.
 * @category Utility
 * @alias refreshCookie
 * @param {string=} cookie - The cookie to refresh.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * const newCookie = await noblox.refreshCookie("COOKIEHERE")
**/

// Refreshes the internally stored cookie, or the cookie provided
// Stores the new cookie & returns it
function refreshCookie (cookie) {
  if (cookie) {
    options.jar.session = cookie
  }

  return getGeneralToken({}).then((token) => {
    return http({
      url: 'https://www.roblox.com/authentication/signoutfromallsessionsandreauthenticate',
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar: null,
        headers: {
          'X-CSRF-TOKEN': token
        }
      }
    }).then((res) => {
      const cookies = res.headers['set-cookie']
      if (cookies) {
        const cookie = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1]
        options.jar.session = cookie
        return cookie
      } else {
        throw new Error('Failed to refresh cookie: None returned.')
      }
    })
  })
}

module.exports = refreshCookie

// Includes
const options = require('../options.js')
const getGeneralToken = require('./getGeneralToken.js').func
const http = require('./http.js').func
// Args
exports.required = []
exports.optional = ['cookie']

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

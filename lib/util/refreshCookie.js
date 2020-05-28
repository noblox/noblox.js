// Includes
var options = require('../options.js')
var getGeneralToken = require('./getGeneralToken.js').func
var getVerification = require('./getVerification.js').func
var http = require('./http.js').func
// Args
exports.required = []
exports.optional = ['cookie']

// Refreshes the internally stored cookie, or the cookie provided
// Stores the new cookie & returns it
function refreshCookie (cookie) {
  if (cookie) {
    options.jar.session = cookie
  }
  return getVerification({ url: 'https://www.roblox.com/my/account#!/security' })
    .then((ver) => {
      if (!ver.header) throw new Error('Failed to refresh - Invalid or expired cookie.')
      return getGeneralToken({}).then((token) => {
        return http({
          url: 'https://www.roblox.com/authentication/signoutfromallsessionsandreauthenticate',
          options: {
            method: 'POST',
            resolveWithFullResponse: true,
            verification: ver.header,
            jar: null,
            headers: {
              'X-CSRF-TOKEN': token
            },
            form: {
              __RequestVerificationToken: ver.inputs.__RequestVerificationToken
            }
          }
        }).then((res) => {
          var cookies = res.headers['set-cookie']
          if (cookies) {
            const cookie = cookies.toString().match(/\.ROBLOSECURITY=(.*?);/)[1]
            options.jar.session = cookie
            return cookie
          } else {
            throw new Error('Failed to refresh cookie: None returned.')
          }
        })
      })
    })
}

module.exports = refreshCookie

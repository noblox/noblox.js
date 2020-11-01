// Includes
const http = require('./http.js').func

// Args
exports.optional = ['option', 'jar']

// Docs
/**
 * Get the current logged in user.
 * @category Utility
 * @alias getCurrentUser
 * @param {string=} option - A specific option to return.
 * @returns {LoggedInUserData}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie.
 * const user = await noblox.getCurrentUser()
**/

// Define
exports.func = function (args) {
  const jar = args.jar
  const option = args.option
  const httpOpt = {
    url: '//www.roblox.com/mobileapi/userinfo',
    options: {
      resolveWithFullResponse: true,
      method: 'GET',
      followRedirect: false,
      jar: jar
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode !== 200) {
        throw new Error('You are not logged in.')
      } else {
        const json = JSON.parse(res.body)
        return (option ? json[option] : json)
      }
    })
}

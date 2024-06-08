// Includes
const http = require('./http.js').func

// Args
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get the current authenticated user.
 * @category Utility
 * @alias getAuthenticatedUser
 * @returns {AuthenticatedUserData}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie.
 * const user = await noblox.getAuthenticatedUser()
**/

// Define
exports.func = async function (args) {
  const jar = args.jar
  const httpOpt = {
    url: '//users.roblox.com/v1/users/authenticated',
    options: {
      method: 'GET',
      followRedirect: false,
      jar,
      json: true,
      resolveWithFullResponse: true
    }
  }

  const res = await http(httpOpt)

  if (res.statusCode === 401) {
    throw new Error('You are not logged in.')
  } else if (res.statusCode !== 200) {
    throw new Error(JSON.stringify(res.body))
  }

  return res.body
}

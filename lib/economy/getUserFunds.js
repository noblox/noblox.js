// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔓 Gets the amount of robux for the authenticated user.
 * @category User
 * @param {number} userId - Must match the userId of the authenticated user
 * @alias getUserFunds
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const currentUser = await noblox.setCookie(process.env.ROBLOXCOOKIE)
 * const robux = await noblox.getUserFunds(currentUser.id)
 */

// Define
function getUserFunds (userId, jar) {
  return http({
    url: `//economy.roblox.com/v1/users/${userId}/currency`,
    options: {
      jar,
      resolveWithFullResponse: true
    }
  })
    .then((res) => {
      const { robux } = JSON.parse(res.body)
      if (res.statusCode === 200) {
        return robux
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

exports.func = function ({ userId, jar }) {
  return getUserFunds(userId, jar)
}

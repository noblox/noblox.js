// Includes
const http = require('../util/http.js').func

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
    .then(({ statusCode, body }) => {
      const { robux, errors } = JSON.parse(body)
      if (statusCode === 200) {
        return robux
      } else if (statusCode === 400 || statusCode === 403) {
        throw new Error(`${errors[0].message} | userId: ${userId}`)
      } else {
        throw new Error(`An unknown error occurred with getUserFunds() | [${statusCode}] userId: ${userId}`)
      }
    })
}

exports.func = function ({ userId, jar }) {
  return getUserFunds(userId, jar)
}

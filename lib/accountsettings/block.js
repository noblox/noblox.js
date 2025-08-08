// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Block a user.
 * @category AccountSettings
 * @alias block
 * @param {number} userId - The id of the user that is being blocked.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.block(123456)
**/

// Define
function block (jar, token, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://apis.roblox.com/user-blocking-api/v1/users/${userId}/block-user`,
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve()
        } else {
          reject(new RobloxAPIError(res))
        }
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return block(jar, xcsrf, args.userId)
    })
}

// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Gets whether or not a user has premium.
 * @category User
 * @alias getPremium
 * @param {number} userId - The id of the user.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const hasPremium = await noblox.getPremium(123456)
 **/

// Define
function getPremium (jar, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://premiumfeatures.roblox.com/v1/users/${userId}/validate-membership`,
      options: {
        method: 'GET',
        jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body === 'true')
        } else {
          reject(new RobloxAPIError(res))
        }
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getPremium(jar, args.userId)
}

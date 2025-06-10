// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']

// Docs
/**
 * ✅ Get a user's blurb - a user's description.
 * @category User
 * @deprecated Obsolete function, will be deleted in future version. Use getPlayerInfo instead.
 * @alias getBlurb
 * @param {number} userId - The id of the user's blurb that is being retrieved.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * let blurb = await noblox.getBlurb({ userId: 123456 })
**/

// Define
exports.func = function (args) {
  return http({
    url: `//users.roblox.com/v1/users/${args.userId}`,
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  })
    .then(function (res) {
      if (res.statusCode === 200) {
        const parsedBody = JSON.parse(res.body)
        return parsedBody.description
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

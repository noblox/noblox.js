// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get the social link data (promotion channels) associated with a user.
 * @category AccountInformation
 * @alias getUserSocialLinks
 * @param {number} userId - The id of the user.
 * @returns {Promise<PromotionChannelsResponse>}
 * @example const noblox = require("noblox.js")
 * const userSocialLinks = await noblox.getUserSocialLinks(2416399685)
**/

// Define
function getUserSocialLinks (userId, jar) {
  return http({
    url: `//accountinformation.roblox.com/v1/users/${userId}/promotion-channels`,
    options: {
      jar,
      resolveWithFullResponse: true
    }
  })
    .then((res) => {
      if (res.statusCode === 200) {
        return JSON.parse(res.body)
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

exports.func = function ({ userId, jar }) {
  return getUserSocialLinks(userId, jar)
}

// Includes
const http = require('../util/http.js').func

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
      jar: jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ status, data: resData }) => {
      const { errors } = resData
      if (status === 200) {
        return resData
      } else if (status === 400) {
        throw new Error(`${errors[0].message} | userId: ${userId}`)
      } else {
        throw new Error(`An unknown error occurred with getUserSocialLinks() | [${status}] userId: ${userId}`)
      }
    })
}

exports.func = function ({ userId, jar }) {
  return getUserSocialLinks(userId, jar)
}

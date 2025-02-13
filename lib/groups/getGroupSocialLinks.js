// Includes
const http = require('../util/http.js').func

const RobloxAPIError = require('../util/apiError.js')
// Args
exports.required = ['groupId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get the social link data associated with a group.
 * @category Group
 * @alias getGroupSocialLinks
 * @param {number} groupId - The id of the group.
 * @returns {Promise<SocialLinkResponse[]>}
 * @example const noblox = require("noblox.js")
 * const groupSocialLinks = await noblox.getGroupSocialLinks(9997719)
**/

// Define
function getGroupSocialLinks (groupId, jar) {
  return http({
    url: `//groups.roblox.com/v1/groups/${groupId}/social-links`,
    options: {
      jar,
      resolveWithFullResponse: true
    }
  })
    .then((res) => {
      const { data } = JSON.parse(res.body)
      if (res.statusCode === 200 && data) {
        return data
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

exports.func = function ({ groupId, jar }) {
  return getGroupSocialLinks(groupId, jar)
}

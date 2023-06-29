// Includes
const http = require('../util/http.js').func

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
      jar: jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ status, data: resData }) => {
      const { errors, data } = resData
      if (status === 200 && data) {
        return data
      } else if (status === 400 || status === 403 || status === 404) {
        throw new Error(`${errors[0].message} | groupId: ${groupId}`)
      } else if (status === 401) {
        throw new Error(`${errors[0].message} (Are you logged in?) | groupId: ${groupId}`)
      } else {
        throw new Error(`An unknown error occurred with getGroupSocialLinks() | [${status}] groupId: ${groupId}`)
      }
    })
}

exports.func = function ({ groupId, jar }) {
  return getGroupSocialLinks(groupId, jar)
}

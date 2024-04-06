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
      jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ statusCode, body }) => {
      const { errors, data } = body
      if (statusCode === 200 && data) {
        return data
      } else if (statusCode === 400 || statusCode === 403 || statusCode === 404) {
        throw new Error(`${errors[0].message} | groupId: ${groupId}`)
      } else if (statusCode === 401) {
        throw new Error(`${errors[0].message} (Are you logged in?) | groupId: ${groupId}`)
      } else {
        throw new Error(`An unknown error occurred with getGroupSocialLinks() | [${statusCode}] groupId: ${groupId}`)
      }
    })
}

exports.func = function ({ groupId, jar }) {
  return getGroupSocialLinks(groupId, jar)
}

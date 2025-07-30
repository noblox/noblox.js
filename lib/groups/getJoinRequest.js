// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group', 'userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Gets a specific join request, given a user ID.
 * @category Group
 * @alias getJoinRequest
 * @param {number} group - The id of the group.
 * @param {number} userId - The user ID whose join request is wanted.
 * @returns {(Promise<GroupJoinRequest>|Promise<null>)} A join request if one exists, or null.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const request = await noblox.getJoinRequest(4591072, 5903228)
**/

// Define
function getJoinRequest (jar, group, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/join-requests/users/${userId}`,
      options: {
        method: 'GET',
        jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body) || null)
        } else {
          reject(new RobloxAPIError(res))
        }
      }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getJoinRequest(jar, args.group, args.userId)
}

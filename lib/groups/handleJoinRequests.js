const RobloxAPIError = require('../util/apiError.js')

// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'userIds', 'accept']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Batch accept/decline multiple users' join requests.
 * @category Group
 * @alias handleJoinRequest
 * @param {number} group - The id of the group.
 * @param {Array<number>} userIds - The ids of the users.
 * @param {boolean} accept - If the users should be accepted into the group.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.handleJoinRequests(1, [1], true)
**/

function handleJoinRequests (group, userIds, accept, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/join-requests`,
      options: {
        method: accept ? 'POST' : 'DELETE',
        resolveWithFullResponse: true,
        jar,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': xcsrf
        },
        body: JSON.stringify({
          UserIds: userIds
        })
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode !== 200) {
          reject(new RobloxAPIError(res))
        } else {
          resolve()
        }
      }).catch(error => reject(error))
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return handleJoinRequests(args.group, args.userIds, args.accept, args.jar, xcsrf)
    })
}

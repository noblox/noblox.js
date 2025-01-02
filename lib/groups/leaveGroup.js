// Includes
const http = require('../util/http.js').func
const getCurrentUser = require('../util/getCurrentUser').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group']
exports.optional = []

// Docs
/**
 * 🔐 Leave a group.
 * @category Group
 * @alias leaveGroup
 * @param {number} group - The id of the group.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.leaveGroup(1)
**/

// Define
function leaveGroup (group, jar, xcsrf, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/users/${userId}`,
      options: {
        method: 'DELETE',
        resolveWithFullResponse: true,
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
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

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(async function (xcsrf) {
      const currentUser = await getCurrentUser({ jar })
      return leaveGroup(args.group, args.jar, xcsrf, currentUser.UserID)
    })
}

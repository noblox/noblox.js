// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'userId', 'accept']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Accept/decline a user's join request.
 * @category Group
 * @alias handleJoinRequest
 * @param {number} group - The id of the group.
 * @param {number} userId - The id of the user.
 * @param {boolean} accept - If the user should be accepted into the group.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.handleJoinRequest(1, 1, true)
**/

function handleJoinRequest (group, userId, accept, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/join-requests/users/${userId}`,
      options: {
        method: accept ? 'POST' : 'DELETE',
        resolveWithFullResponse: true,
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
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
      return handleJoinRequest(args.group, args.userId, args.accept, args.jar, xcsrf)
    })
}

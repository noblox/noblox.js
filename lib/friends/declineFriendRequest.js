// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Decline a user's friend request.
 * @category User
 * @alias declineFriendRequest
 * @param {number} userId - The id of the user that sent the friend request that is being declined.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.declineFriendRequest(123456)
**/

// Define
function declineFriendRequest (jar, token, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//friends.roblox.com/v1/users/${userId}/decline-friend-request`,
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/json'
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve()
        } else {
          reject(new RobloxAPIError(res))
        }
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return declineFriendRequest(jar, xcsrf, args.userId)
    })
}

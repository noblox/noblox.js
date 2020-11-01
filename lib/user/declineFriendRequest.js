// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * Decline a user's friend request.
 * @category User
 * @alias declineFriendRequest
 * @param {number} userId - The id of the user that sent the friend request that is being declinend.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.declineFriendRequest(123456)
**/

// Define
function declineFriendRequest (jar, token, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//friends.roblox.com/v1/users/${userId}/decline-friend-request`,
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve()
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return declineFriendRequest(jar, xcsrf, args.userId)
    })
}

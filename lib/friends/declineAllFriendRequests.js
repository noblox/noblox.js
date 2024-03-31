// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = []
exports.optional = ['jar']

// Docs
/**
 * 🔐 Decline all incoming friend requests.
 * @category User
 * @alias declineAllFriendRequests
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.declineAllFriendRequests()
**/

// Define
function declineAllFriendRequests (jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//friends.roproxy.com/v1/user/friend-requests/decline-all',
      options: {
        method: 'POST',
        jar,
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
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return declineAllFriendRequests(jar, xcsrf)
    })
}

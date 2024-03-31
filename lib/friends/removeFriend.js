// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Remove a user from your friends list.
 * @category User
 * @alias removeFriend
 * @param {number} userId - The id of the user.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.removeFriend(123456)
**/

// Define
function removeFriend (jar, token, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//friends.roproxy.com/v1/users/${userId}/unfriend`,
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
      return removeFriend(jar, xcsrf, args.userId)
    })
}

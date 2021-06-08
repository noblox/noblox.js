// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Unblock a user.
 * @category User
 * @alias unblock
 * @param {number} userId - The id of the user.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.unblock(123456)
**/

// Define
function unblock (jar, token, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//www.roblox.com/userblock/unblockuser',
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          blockeeId: userId
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          const body = res.body
          if (!body.success) {
            reject(new Error(body.error || body.message))
          }
          resolve()
        } else {
          reject(new Error('Unblock failed'))
        }
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return unblock(jar, xcsrf, args.userId)
    })
}

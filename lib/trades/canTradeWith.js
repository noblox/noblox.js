// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Check if the signed in user can trade with another user.
 * @category Trade
 * @alias canTradeWith
 * @param {number} userId - The id of the user.
 * @returns {Promise<CanTradeResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const canTrade = await noblox.canTradeWith(1234)
**/

// Define
function canTradeWith (jar, userId) {
  return new Promise((resolve, reject) => {
    http({
      url: '//trades.roblox.com/v1/users/' + userId + '/can-trade-with',
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        resolve(JSON.parse(res.body))
      } else {
        const body = JSON.parse(res.body) || {}
        if (body.errors && body.errors.length > 0) {
          const errors = body.errors.map((e) => {
            return e.message
          })
          reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
        }
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  return canTradeWith(args.jar, args.userId)
}

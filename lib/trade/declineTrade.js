// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['tradeId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Decline an active trade.
 * @category Trade
 * @alias declineTrade
 * @param {number} tradeId - The tradeId to decline.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.declineTrade(1234)
**/

// Define
function declineTrade (tradeId, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    http({
      url: '//trades.roblox.com/v1/trades/' + tradeId + '/decline',
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf,
          'Content-Type': 'application/json'
        }
      }
    }).then((res) => {
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
    }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return declineTrade(args.tradeId, jar, xcsrf)
    })
}

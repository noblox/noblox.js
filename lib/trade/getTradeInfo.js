// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['tradeId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get detailed information for a specific trade.
 * @category Trade
 * @alias getTradeInfo
 * @param {Number} tradeId - The id of the trade.
 * @returns {Promise<TradeInfo>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const tradeInfo = await noblox.getTradeInfo(1234)
**/

// Define
const getTradeInfo = (jar, tradeId) => {
  return new Promise((resolve, reject) => {
    http({
      url: '//trades.roblox.com/v1/trades/' + tradeId,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body)
        body.created = new Date(body.created)
        if (body.expiration) body.expiration = new Date(body.expiration)

        resolve(body)
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

exports.func = (args) => {
  return getTradeInfo(args.jar, args.tradeId)
}

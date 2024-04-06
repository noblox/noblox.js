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
 * @param {number} tradeId - The id of the trade.
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
        jar
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        const body = res.body
        body.created = new Date(body.created)
        if (body.expiration) body.expiration = new Date(body.expiration)

        resolve(body)
      } else {
        const body = res.body || {}
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
  return getTradeInfo(args.jar, args.tradeId)
}

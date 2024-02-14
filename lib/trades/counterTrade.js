// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const getCurrentUser = require('../util/getCurrentUser.js').func

// Args
exports.required = ['tradeId', 'targetUserId', 'sendingOffer', 'receivingOffer']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Counter an active incoming trade.
 * @category Trade
 * @alias counterTrade
 * @param {number} tradeId - The id of the active trade
 * @param {number} targetUserId - The user to send the trade to.
 * @param {TradeOffer} sendingOffer - The offer to send to the other user.
 * @param {TradeOffer} recievingOffer - The offer you are requesting from the other user.
 * @returns {Promise<SendTradeResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.counterTrade(1234, 80231025, { userAssetIds: [23289506393] }, { userAssetIds: [32924150919] })
**/

// Define
function counterTrade (tradeId, targetUserId, sendingOffer, receivingOffer, jar, xcsrf, loggedInUser) {
  return new Promise((resolve, reject) => {
    if (!sendingOffer.userAssetIds || !receivingOffer.userAssetIds) {
      reject(new Error('Both offers must includes userAssetIds.'))
    }

    if (!sendingOffer.robux) sendingOffer.robux = 0
    if (!receivingOffer.robux) receivingOffer.robux = 0

    http({
      url: '//trades.roblox.com/v1/trades/' + tradeId + '/counter',
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          offers: [
            {
              userId: targetUserId,
              ...receivingOffer
            },
            {
              userId: loggedInUser,
              ...sendingOffer
            }
          ]
        })
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

exports.func = function (args) {
  const jar = args.jar
  return Promise.all([
    getGeneralToken({ jar }),
    getCurrentUser({ jar, option: 'UserID' })
  ])
    .then(function (resolvedPromises) {
      return counterTrade(args.tradeId, args.targetUserId, args.sendingOffer, args.receivingOffer, jar, resolvedPromises[0], resolvedPromises[1])
    })
}

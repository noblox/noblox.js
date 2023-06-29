// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const getCurrentUser = require('../util/getCurrentUser.js').func

// Args
exports.required = ['targetUserId', 'sendingOffer', 'receivingOffer']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Send a trade to another user.
 * @category Trade
 * @alias sendTrade
 * @param {number} targetUserId - The user to send the trade to.
 * @param {TradeOffer} sendingOffer - The offer to send to the other user.
 * @param {TradeOffer} recievingOffer - The offer you are requesting from the other user.
 * @returns {Promise<SendTradeResponse>}
 * @example const noblox = require("noblox.js")
 * noblox.sendTrade(80231025, { userAssetIds: [23289506393] }, { userAssetIds: [32924150919] })
**/

// Define
function sendTrade (targetUserId, sendingOffer, receivingOffer, jar, xcsrf, loggedInUser) {
  return new Promise((resolve, reject) => {
    if (!sendingOffer.userAssetIds || !receivingOffer.userAssetIds) {
      reject(new Error('Both offers must includes userAssetIds.'))
    }

    if (!sendingOffer.robux) sendingOffer.robux = 0
    if (!receivingOffer.robux) receivingOffer.robux = 0

    http({
      url: '//trades.roblox.com/v1/trades/send',
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar: jar,
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
      if (res.status === 200) {
        resolve(res.data)
      } else {
        const body = res.data || {}

        if (body.errors && body.errors.length > 0) {
          const errors = body.errors.map((e) => {
            return e.message
          })
          reject(new Error(`${res.status} ${errors.join(', ')}`))
        }
      }
    }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  const jar = args.jar
  return Promise.all([
    getGeneralToken({ jar: jar }),
    getCurrentUser({ jar: jar, option: 'UserID' })
  ])
    .then(function (resolvedPromises) {
      return sendTrade(args.targetUserId, args.sendingOffer, args.receivingOffer, jar, resolvedPromises[0], resolvedPromises[1])
    })
}

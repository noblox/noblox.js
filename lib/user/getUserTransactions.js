const http = require('../util/http.js').func
const getCurrentUser = require('../util/getCurrentUser.js').func

exports.required = []
exports.optional = ['transactionType', 'limit', 'cursor', 'jar']

// Docs
/**
 * 🔐 Get a user's transactions.
 * @category User
 * @alias getUserTransactions
 * @param {("Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout")} [transactionType=Sale] - The type of transactions being fetched.
 * @param {Limit=} [limit=100] - The number of transactions being fetched each request. | [10, 25, 50, 100]
 * @param {string=} cursor - The previous or next page cursor.
 * @returns {Promise<TransactionPage>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * let transactions = await noblox.getUserTransactions("Sale", 10)
**/

function getTransactions (userId, transactionType, limit, cursor, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://economy.roblox.com/v2/users/${userId}/transactions?limit=${limit}&transactionType=${transactionType}&cursor=${cursor}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve(responseData)
        }
      })
  })
}

// Define
exports.func = async function (args) {
  const jar = args.jar
  const transactionType = args.transactionType || 'Sale'
  const limit = args.limit || 100
  const cursor = args.cursor || ''
  const currentUser = await getCurrentUser({ jar: jar })
  return getTransactions(currentUser.UserID, transactionType, limit, cursor)
}

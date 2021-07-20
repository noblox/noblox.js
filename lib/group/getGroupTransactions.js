const http = require('../util/http.js').func

exports.required = ['group']
exports.optional = ['transactionType', 'limit', 'cursor', 'jar']

// Docs
/**
 * 🔐 Get a group's transactions.
 * @category Group
 * @alias getGroupTransactions
 * @param {number} group - The id of the group.
 * @param {("Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout")} transactionType - The transaction type.
 * @param {Limit=} limit - The maximum results per a page.
 * @param {string=} cursor - The cursor for the next page.
 * @returns {Promise<TransactionPage>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const transactions = await noblox.getGroupTransactions(1, "Sale")
**/

function getTransactions (group, transactionType, limit, cursor, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://economy.roblox.com/v1/groups/${group}/transactions?limit=${limit}&transactionType=${transactionType}&cursor=${cursor}`,
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
exports.func = function (args) {
  const transactionType = args.transactionType || 'Sale'
  const limit = args.limit || 100
  const cursor = args.cursor || ''
  return getTransactions(args.group, transactionType, limit, cursor)
}

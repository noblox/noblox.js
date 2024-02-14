const getPageResults = require('../util/getPageResults.js').func
const getCurrentUser = require('../util/getCurrentUser.js').func

exports.required = []
exports.optional = ['transactionType', 'limit', 'sortOrder', 'jar']

// Docs
/**
 * 🔐 Get a user's transactions.
 * @category User
 * @alias getUserTransactions
 * @param {("Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout")} [transactionType=Sale] - The type of transactions being fetched.
 * @param {number} limit - The number of transactions being fetched in total.
 * @param {SortOrder=} [sortOrder=Asc] - The cursor for the next page.
 * @returns {Promise<TransactionItem[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * let transactions = await noblox.getUserTransactions("Sale", 10)
**/

exports.func = async function (args) {
  const jar = args.jar
  const currentUser = await getCurrentUser({ jar })
  // return getTransactions(currentUser.UserID, transactionType, limit, cursor)
  return getPageResults({
    jar: args.jar,
    url: `//economy.roblox.com/v2/users/${currentUser.UserID}/transactions`,
    query: {
      transactionType: args.transactionType || 'Sale'
    },
    sortOrder: args.sortOrder || 'Asc',
    limit: args.limit
  })
}

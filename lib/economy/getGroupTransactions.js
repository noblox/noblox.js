const getPageResults = require('../util/getPageResults.js').func

exports.required = ['group']
exports.optional = ['transactionType', 'limit', 'sortOrder', 'jar']

// Docs
/**
 * 🔐 Get a group's transactions.
 * @category Group
 * @alias getGroupTransactions
 * @param {number} group - The id of the group.
 * @param {("Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout")} [transactionType=Sale] - The transaction type.
 * @param {number} limit - The number of transactions being fetched in total.
 * @param {SortOrder=} [sortOrder=Asc] - The cursor for the next page.
 * @returns {Promise<TransactionItem[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const transactions = await noblox.getGroupTransactions(1, "Sale")
**/

// Define
exports.func = function (args) {
  return getPageResults({
    jar: args.jar,
    url: `//economy.roblox.com/v2/groups/${args.group}/transactions`,
    query: {
      transactionType: args.transactionType || 'Sale'
    },
    sortOrder: args.sortOrder || 'Asc',
    limit: args.limit
  })
}

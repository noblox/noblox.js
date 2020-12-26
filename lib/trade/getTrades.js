// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['tradeStatusType']
exports.optional = ['sortOrder', 'limit', 'jar']

// Docs
/**
 * Get the trades for a specific category.
 * @category Trade
 * @alias getTrades
 * @param {String} tradeStatusType - The status of the trades to get.
 * @param {SortOrder=} [sortOrder=Asc] - The order that the data will be returned in (Asc or Desc)
 * @param {Limit=} [limit=10] - The number of assets returned in each request (10, 25, 50, or 100)
 * @returns {Promise<TradeAsset[]>}
 * @example const noblox = require("noblox.js")
 * const trades = await noblox.getTrades("Inbound")
**/

// Define
exports.func = function (args) {
  return getPageResults({
    jar: args.jar,
    url: `//trades.roblox.com/v1/trades/${args.tradeStatusType}`,
    sortOrder: args.sortOrder,
    limit: args.limit
  }).then(function (results) {
    results.forEach(result => {
      result.created = new Date(result.created)
      result.expiration = new Date(result.expiration)
    })

    return results
  })
}

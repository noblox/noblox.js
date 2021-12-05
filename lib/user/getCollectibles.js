// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId']
exports.optional = ['assetType', 'sortOrder', 'limit', 'jar']

// Docs
/**
 * 🔓 Get a user's collectibles.
 * @category User
 * @alias getCollectibles
 * @param {number} userId - The id of the user whose collectibles are being retrieved.
 * @param {SortOrder=} [sortOrder=Asc] - The order that the collectibles will bee sorted by (Asc or Desc)
 * @param {string=} assetType - The asset type for the collectibles you're trying to get.
 * @param {Limit=} [limit=10] - The amount of results per request.
 * @returns {Promise<Collectibles>}
 * @example const noblox = require("noblox.js")
 * let collectibles = await noblox.getCollectibles({userId: 123456, sortOrder: "Asc", limit: 100})
**/

// Define
exports.func = function (args) {
  return getPageResults({
    jar: args.jar,
    url: `//inventory.roblox.com/v1/users/${args.userId}/assets/collectibles`,
    query: { assetType: args.assetType },
    sortOrder: args.sortOrder,
    limit: args.limit
  })
}

// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId', 'assetTypeId']
exports.optional = ['sortOrder', 'limit', 'jar']

// Docs
/**
 * Get a user's inventory.
 * @category User
 * @alias getInventoryById
 * @param {number} userId - The id of user whose inventory is being returned.
 * @param {array} assetTypeId - The asset type id of the items to get.
 * @param {string=} [sortOrder=Asc] - The order that the data will be returned in (Asc or Desc)
 * @param {number=} [limit=10] - The number of assets returned in each request (10, 25, 50, or 100)
 * @returns {Promise<Inventory>}
 * @example const noblox = require("noblox.js")
 * let inventory = await noblox.getInventoryById({userId: 123456, assetTypeId: 2, sortOrder: "Asc", limit: 100})
**/

// Define
exports.func = function (args) {
  return getPageResults({
    jar: args.jar,
    url: `//inventory.roblox.com/v2/users/${args.userId}/inventory/${args.assetTypeId}`,
    query: {},
    sortOrder: args.sortOrder,
    limit: args.limit
  })
}

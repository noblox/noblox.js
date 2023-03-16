// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId', 'assetTypeId']
exports.optional = ['sortOrder', 'limit', 'jar']

// Docs
/**
 * 🔓 Get a user's inventory.
 * @category User
 * @alias getInventoryById
 * @param {number} userId - The id of user whose inventory is being returned.
 * @param {Array<number>} assetTypeId - The types of assets being retrieved: [(11, 12)]{@link https://developer.roblox.com/en-us/api-reference/enum/AssetType}.
 * @param {SortOrder=} [sortOrder=Asc] - The order that the data will be returned in (Asc or Desc)
 * @param {Limit=} [limit=10] - The number of assets returned in each request (10, 25, 50, or 100)
 * @returns {Promise<InventoryEntry[]>}
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

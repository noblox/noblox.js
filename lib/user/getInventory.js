// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId', 'assetTypes']
exports.optional = ['sortOrder', 'limit', 'jar']

// Docs
/**
 * Get a user's inventory.
 * @category User
 * @alias getInventory
 * @param {number} userId - The id of user whose inventory is being returned.
 * @param {array} assetTypes - The types of assets being retrieved.
 * @param {string=} [sortOrder=Asc] - The order that the data will be returned in (Asc or Desc)
 * @param {number=} [limit=10] - The number of assets returned in each request (10, 25, 50, or 100)
 * @returns {Promise<Inventory>}
 * @example const noblox = require("noblox.js")
 * let inventory = await noblox.getInventory({userId: 123456, assetTypes: ["Shirt"], sortOrder: "Asc", limit: 100})
**/

// Define
exports.func = function (args) {
  return getPageResults({
    jar: args.jar,
    url: `//inventory.roblox.com/v2/users/${args.userId}/inventory`,
    query: { assetTypes: args.assetTypes.join(',') },
    sortOrder: args.sortOrder,
    limit: args.limit
  })
}

// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['groupId', 'assetType']
exports.optional = ['sortOrder', 'limit', 'jar']

// Docs
/**
 * 🔐 Get assets for a group.
 * @category Group
 * @alias getGroupAssets
 * @param {number} groupId - The id of the group.
 * @param {String} assetType - The type of asset being retrieved: [("Shirt", "Pants")]{@link https://developer.roblox.com/en-us/api-reference/enum/AssetType}.
 * @param {SortOrder=} [sortOrder=Asc] - The order results are sorted in.
 * @param {Limit=} [limit=∞] - The maximum number of assets to return
 * @returns {Promise<GroupAssetInfo[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const groupModels = await noblox.getGroupAssets({groupId: 1, assetType: 'Model', sortOrder: 'Asc', limit: '100'})
**/

// Define
exports.func = function (args) {
  return getPageResults({
    jar: args.jar,
    url: '//itemconfiguration.roblox.com/v1/creations/get-assets',
    query: { assetType: args.assetType, groupId: args.groupId },
    sortOrder: args.sortOrder || 'Asc',
    limit: args.limit
  })
}

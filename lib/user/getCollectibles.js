// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId']
exports.optional = ['assetType', 'sortOrder', 'limit', 'jar']

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

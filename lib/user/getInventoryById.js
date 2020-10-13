// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId', 'assetTypeId']
exports.optional = ['sortOrder', 'limit', 'jar']

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

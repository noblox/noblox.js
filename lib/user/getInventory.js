// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId', 'assetTypes']
exports.optional = ['sortOrder', 'limit', 'jar']

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

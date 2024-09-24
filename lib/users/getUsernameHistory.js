// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId']
exports.optional = ['limit', 'sortOrder', 'pageCursor']

// Docs
/**
 * ✅ Get a user's username history.
 * @category User
 * @alias getUsernameHistory
 * @param { number } userId
 * @param { number } [limit=10]
 * @param { SortOrder= } [sortOrder=Asc]
 * @param { string } cursor
 * @returns {Promise<UsernameHistoryEntry[]>}
 * @example const noblox = require("noblox.js")
 * const history = await noblox.getUsernameHistory(1, 10, "Asc", "cursorstring")
**/

// Define
exports.func = function (args) {
  return getPageResults({
    url: `//users.roblox.com/v1/users/${args.userId}/username-history`,
    query: {},
    limit: args.limit,
    pageCursor: args.pageCursor,
    sortOrder: args.sortOrder
  })
}

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
 * @param {number} userId
 * @param {Limit=} [limit=10]
 * @param {SortOrder=} [sortOrder=Asc]
 * @param {string} cursor
 * @returns {Promise<UsernameHistoryEntry[]>}
 * @example const noblox = require("noblox.js")
 * const history = await noblox.getUsernameHistory({ userId: 1, limit: 10, sortOrder: "Asc", cursor: "somecursorstring" })
**/

// Define
function getUsernameHistory (userId, limit, sortOrder, cursor) {
  return getPageResults({
    url: `//users.roblox.com/v1/users/${userId}/username-history`,
    query: {},
    limit,
    pageCursor: cursor,
    sortOrder
  })
}

exports.func = function (args) {
  return getUsernameHistory(args.userId, args.limit, args.sortOrder, args.cursor)
}

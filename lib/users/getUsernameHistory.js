// Includes
const getPageResults = require('../util/getPageResults.js').func
const cache = require('../cache')

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
  let { userId, limit, sortOrder, cursor } = args;
  limit ||= 100
  sortOrder ||= 'Asc'

  return cache.wrap('UsernameHistory', `${userId}-${limit}-${sortOrder}-${cursor}`, function () {
    return getUsernameHistory(userId, limit, sortOrder, cursor)
  })
}

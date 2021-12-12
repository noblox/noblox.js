// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId']
exports.optional = ['accessFilter', 'sortOrder', 'limit']

// Docs
/**
 * ✅ Get a users's games.
 * @category Game
 * @alias getUserGames
 * @param {number} userId - The id of the group.
 * @param {("All" | "Public" | "Private")=} [accessFilter=All] - Filtering games via access level.
 * @param {SortOrder=} [sortOrder=Asc] - The order results are sorted in.
 * @param {Limit=} [limit=∞] - The maximum number of games to return
 * @returns {Promise<GroupGameInfo[]>}
 * @example const noblox = require("noblox.js")
 * const userGames = await noblox.getUserGames({userId: 1, accessFilter: 'All', sortOrder: 'Asc', limit: '100'})
**/

// Define
exports.func = function (args) {
  return getPageResults({
    url: `//games.roblox.com/v2/users/${args.userId}/games`,
    query: { accessFilter: args.accessFilter || 'Public' },
    sortOrder: args.sortOrder || 'Asc',
    limit: args.limit
  })
}

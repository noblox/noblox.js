// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['groupId']
exports.optional = ['accessFilter', 'sortOrder', 'limit']

// Docs
/**
 * ✅ Get a group's games.
 * @category Group
 * @alias getGroupGames
 * @param {number} groupId - The id of the group.
 * @param {("All" | "Public" | "Private")=} [accessFilter=All] - Filtering games via access level.
 * @param {SortOrder=} [sortOrder=Asc] - The order results are sorted in.
 * @param {Limit=} [limit=∞] - The maximum number of games to return
 * @returns {Promise<GroupGameInfo[]>}
 * @example const noblox = require("noblox.js")
 * const groupGames = await noblox.getGroupGames({groupId: 1, accessFilter: 'All', sortOrder: 'Asc', limit: '100'})
**/

// Define
exports.func = function (args) {
  return getPageResults({
    url: `//games.roproxy.com/v2/groups/${args.groupId}/games`,
    query: { accessFilter: args.accessFilter || 'All' },
    sortOrder: args.sortOrder || 'Asc',
    limit: args.limit
  })
}

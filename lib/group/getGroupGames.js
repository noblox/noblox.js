// Includes
const http = require('../util/http.js').func
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['groupId']
exports.optional = ['accessFilter', 'sortOrder', 'limit', 'cursor']

// Docs
/**
 * Get a group's games.
 * @category Group
 * @alias getGroupGames
 * @param {number} groupId - The id of the group.
 * @param {("All" | "Public" | "Private")} accessFilter - Filtering games via access level.
 * @param {("Asc" | "Desc")} sortOrder - The order results are sorted in.
 * @param {Limit=} [limit=10] - The maximum results per page (10, 25, 50, or 100).
 * @param {string=} cursor - The cursor for the next page.
 * @returns {Promise<GroupGameInfo[]>}
 * @example const noblox = require("noblox.js")
 * const groupGames = await noblox.getGroupGames({groupId: 1, accessFilter: 'All', sortOrder: 'Asc', limit: '100'})
**/

// Define
exports.func = function (args) {
  return getPageResults({
    url: `//games.roblox.com/v2/groups/${args.groupId}/games`,
    accessFilter: args.accessFilter || 'All',
    sortOrder: args.sortOrder || 'Asc',
    limit: args.limit || 10
  })
}

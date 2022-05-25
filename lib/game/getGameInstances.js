// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['placeId']
exports.optional = ['serverType', 'sortOrder', 'limit', 'jar']

// Docs
/**
 * 🔓 Get the servers in a game.
 * @category Game
 * @alias getGameInstances
 * @param {number} placeId - The id of the place.
 * @param {("Public" | "Friend" | "VIP")=} [serverType=Public] - The type of server to get
 * @param {SortOrder=} [sortOrder=Asc] - The order that the servers will be sorted by (Asc or Desc)
 * @param {number=} [limit=∞] - The maximum number of results.
 * @returns {Promise<GameInstance[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const servers = await noblox.getGameInstances(1)
**/

// Define
exports.func = function (args) {
  return getPageResults({
    jar: args.jar,
    url: `//games.roblox.com/v1/games/${args.placeId}/servers/${args.serverType || 'Public'}`,
    sortOrder: args.sortOrder,
    limit: args.limit
  })
}

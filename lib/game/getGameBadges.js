// Includes
const http = require('../util/http').func

// Args
exports.required = ['universeId']
exports.optional = ['limit', 'cursor', 'sortOrder']

// Docs
/**
 * ✅ Get the badges in a specific game.
 * @category Game
 * @alias getGameBadges
 * @param {number} universeId - The id of the universe.
 * @param {Limit=} limit - The max number of badges to return.
 * @param {string=} cursor - The page cursor.
 * @param {SortOrder=} sortOrder - The order to sort badges in. (Asc/Desc)
 * @returns {Promise<BadgeInfo>}
 * @example const noblox = require("noblox.js")
 * const badges = await noblox.getGameBadges(1)
**/

// Define
const gameBadges = async (id, limit, cursor, order) => {
  return http({
    url: `https://badges.roblox.com/v1/universes/${id}/badges?limit=${limit}&cursor=${cursor}&sortOrder=${order}`,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }).then(res => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      return json.data
    } else {
      throw new Error('The game is invalid or does not exist.')
    }
  })
}
exports.func = async (args) => {
  if (isNaN(args.universeId)) {
    throw new Error('The provided Universe ID is not a number.')
  };
  if (args.limit) {
    if (![10, 25, 50, 100].includes(args.limit)) {
      throw new Error('The allowed values are: 10, 25, 50 and 100.')
    };
  };
  if (args.sortOrder) {
    if (args.sortOrder.toLowerCase() !== 'asc' && args.sortOrder.toLowerCase() !== 'desc') {
      throw new Error('Invalid sort order type.')
    }
  }
  const limit = args.limit || 10
  const sortOrder = args.sortOrder || 'Asc'
  const cursor = args.cursor || ''
  return gameBadges(args.universeId, limit, cursor, sortOrder)
}

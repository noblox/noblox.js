// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['universeId']
exports.optional = ['limit']

// Docs
/**
 * ✅ Gets a game's game passes.
 * @category Game
 * @alias getGamePasses
 * @param {number} universeId - The id of the universe.
 * @param {Limit=} limit - The max number of game passes to return.
 * @returns {Promise<GamePassData[]>}
 * @example const noblox = require("noblox.js")
 * const gamePasses = await noblox.getGamePasses(1686885941)
**/

// Define
const getGamePasses = async (universeId, limit) => {
  return getPageResults({
    url: `//apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes?passView=full`,
    limit
  }).catch(err => {
    if (err.httpStatusCode === 404) {
      err.message += '\n\nYou are possibly providing a placeId instead of a universeId.\nUse getPlaceInfo() to retrieve the universeId: https://noblox.js.org/global.html#getPlaceInfo\n'
      throw err
    }
    throw err
  })
}

exports.func = function ({ universeId, limit }) {
  if (isNaN(universeId)) {
    throw new Error('The provided universe ID is not a number.')
  }
  return getGamePasses(universeId, limit)
}

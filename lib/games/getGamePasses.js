// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

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
  const res = await http({
    url: `//apis.roblox.com/game-passes/v1/universes/${universeId}/game-passes?passView=Full`,
    options: {
      json: true,
      resolveWithFullResponse: true
    }
  })

  if (res.statusCode !== 200) {
    throw new RobloxAPIError(res)
  }

  return res.body.gamePasses
}

exports.func = function ({ universeId, limit }) {
  if (isNaN(universeId)) {
    throw new Error('The provided universe ID is not a number.')
  }
  return getGamePasses(universeId, limit)
}

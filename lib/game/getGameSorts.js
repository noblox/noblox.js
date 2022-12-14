// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['gameSortsContext']
exports.optional = []

// Docs
/**
 * ✅ Get the sorts for a game.
 * @category Game
 * @alias getGameSorts
 * @param {string|number} gameSortsContext - The sort context to get.
 * @returns {Promise<GameSorts[]>}
 * @example const noblox = require("noblox.js")
 * const gameSorts = await noblox.getGameSorts("GamesDefaultSorts")
**/

// Define
function getGameSorts (gameSortsContext) {
  return http({
    url: `//games.roblox.com/v1/games/sorts?gameSortsContext=${gameSortsContext}`,
    options: {
      json: true
    }
  })
    .then((body) => {
      const error = body.errors && body.errors[0]
      if (error) {
        throw new Error(error.message)
      }
      return body
    })
}

exports.func = function ({ gameSortsContext }) {
  return getGameSorts(gameSortsContext)
}

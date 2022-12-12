// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['gameSortsContext']
exports.optional = ['jar']

// Docs
/**
 * 🔓 Get the sorts for a game.
 * @category Game
 * @alias getGameSorts
 * @param {string} gameSortsContext - The sort context to get.
 * @returns {Promise<GameSorts[]>}
 * @example const noblox = require("noblox.js")
 * const gameSorts = await noblox.getGameSorts("GamesDefaultSorts")
**/

// Define
function getGameSorts (gameSortsContext, jar) {
  return http({
    url: `//games.roblox.com/v1/games/sorts?gameSortsContext=${gameSortsContext}`,	
    options: {
      jar: jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ statusCode, body }) => {
      const { errors, data } = JSON.parse(body)
      if (statusCode === 200 && data) {
        return data
      } else if (statusCode === 400 || statusCode === 403 || statusCode === 404) {
        throw new Error(`${errors[0].message} | gameSortsContext: ${gameSortsContext}`)
      } else if (statusCode === 401) {
        throw new Error(`${errors[0].message} (Are you logged in?) | gameSortsContext: ${gameSortsContext}`)
      } else {
        throw new Error(`An unknown error occurred with getGameSorts() | [${statusCode}] gameSortsContext: ${gameSortsContext}`)
      }
    })
}

exports.func = function ({ gameSortsContext, jar }) {
  return getGameSorts(gameSortsContext, jar)
}

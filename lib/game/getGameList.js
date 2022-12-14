// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['token']
exports.optional = ['maxRows']

// Docs
/**
 * ✅ Get the sorts for a game.
 * @category Game
 * @alias getGameList
 * @param {string} token - The sort token to get.
 * @param {number} maxRows - The maximum number of rows to return.
 * @returns {Promise<GameList[]>}
 * @see [getGameSorts()](global.html#getGameSorts) - can be used to get the token
 * @example const noblox = require("noblox.js")
 * const gameSorts = await noblox.getGameList("T638064636853412348_Popular,N,H_a5f", 100)
**/

// Define
function getGameList (token, maxRows, jar) {
  return http({
    url: `//games.roblox.com/v1/games/list?sortToken=${token}&startRows=0&maxRows=${maxRows}&hasMoreRows=true`,
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

exports.func = function ({ token, maxRows = 100 }) {
  return getGameList(token, maxRows)
}

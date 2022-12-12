// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['token']
exports.optional = ['jar', 'maxRows']

// Docs
/**
 * 🔓 Get the sorts for a game.
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
      jar: jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ statusCode, body }) => {
      const { errors, data } = JSON.parse(body)
      if (statusCode === 200 && data) {
        return data
      } else if (statusCode === 400 || statusCode === 403 || statusCode === 404) {
        throw new Error(`${errors[0].message} | token: ${gameSortsContext}`)
      } else if (statusCode === 401) {
        throw new Error(`${errors[0].message} (Are you logged in?) | token: ${gameSortsContext}`)
      } else {
        throw new Error(`An unknown error occurred with getGameList() | [${statusCode}] token: ${gameSortsContext}`)
      }
    })
}

exports.func = function ({ token, maxRows = 100, jar }) {
  return getGameList(token, maxRows, jar)
}

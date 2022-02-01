// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['placeId']
exports.optional = ['startIndex', 'jar']

// Docs
/**
 * 🔐 Get the servers in a game.
 * @category Game
 * @alias getGameInstances
 * @param {number} placeId - The id of the place.
 * @param {number=} startIndex - The index to start at.
 * @returns {Promise<GameInstances>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const servers = await noblox.getGameInstances(1)
**/

function getGameInstances (jar, placeId, startIndex) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//www.roblox.com/games/getgameinstancesjson?placeId=${placeId}&startindex=${startIndex}`,
      options: {
        method: 'GET',
        jar: jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body))
        } else {
          const body = res.body || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          } else {
            reject(new Error(`${res.statusCode} ${(res.statusCode === 403 ? "You don't have permission to view this page." : 'An error has occured')}`))
          }
        }
      })
      .catch(error => reject(error))
  })
}

// Define
exports.func = function (args) {
  const startIndex = Number(args.startIndex) || 0
  return getGameInstances(args.jar, args.placeId, startIndex)
}

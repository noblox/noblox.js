const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['universeId']
exports.optional = ['jar']

// Docs
/**
 * 🔓 Get the info for a universe.
 * @category Game
 * @alias getUniverseInfo
 * @param {number | Array<number>} universeId - The id(s) of the universe(s).
 * @returns {Promise<UniverseInformation[]>}
 * @example const noblox = require("noblox.js")
 * const universeInfo = await noblox.getUniverseInfo([ 2152417643 ])
**/

function getUniverseInfo (universeIds, jar) {
  return new Promise((resolve, reject) => {
    if (typeof (universeIds) === 'number') universeIds = [universeIds]

    const httpOpt = {
      url: `//games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`,
      options: {
        json: true,
        resolveWithFullResponse: true,
        jar,
        method: 'GET'
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body.data.map((universe) => {
            universe.created = new Date(universe.created)
            universe.updated = new Date(universe.updated)

            return universe
          }))
        } else {
          reject(new RobloxAPIError(res))
        }
      }).catch(reject)
  })
}

exports.func = function (args) {
  return getUniverseInfo(args.universeId, args.jar)
}

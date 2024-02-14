const http = require('../util/http.js').func

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
      .then(function ({ statusCode, body }) {
        if (statusCode === 200) {
          resolve(body.data.map((universe) => {
            universe.created = new Date(universe.created)
            universe.updated = new Date(universe.updated)

            return universe
          }))
        } else if (body && body.errors) {
          reject(new Error(`[${statusCode}] ${body.errors[0].message} | universeIds: ${universeIds.join(',')} ${body.errors.field ? ` | ${body.errors.field} is incorrect` : ''}`))
        } else {
          reject(new Error(`An unknown error occurred with getUniverseInfo() | [${statusCode}] universeIds: ${universeIds.join(',')}`))
        }
      }).catch(reject)
  })
}

exports.func = function (args) {
  return getUniverseInfo(args.universeId, args.jar)
}

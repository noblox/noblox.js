// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['placeId']
exports.optional = ['jar']

// Docs
/**
 * 🔓 Get the info for a universe.
 * @category Game
 * @alias getPlaceInfo
 * @param {number | Array<number>} universeId - The id(s) of the place(s).
 * @returns {Promise<PlaceInformation[]>}
 * @example const noblox = require("noblox.js")
 * const universeInfo = await noblox.getPlaceInfo([ 10905034443 ])
**/

function getPlaceInfo (placeIds, jar) {
  return new Promise((resolve, reject) => {
    if (typeof (placeIds) === 'number') placeIds = [placeIds]
    
    const httpOpt = {
      url: `//games.roblox.com/v1/games/multiget-place-details?placeIds=${placeIds.join(',')}`,
      options: {
        json: true,
        resolveWithFullResponse: true,
        jar: jar,
        method: 'GET'
      }
    }

    return http(httpOpt)
      .then(function ({ statusCode, body }) {
        if (statusCode === 200) {
          resolve(body)
        } else if (body && body.errors) {
          reject(new Error(`[${statusCode}] ${body.errors[0].message} | placeIds: ${placeIds.join(',')} ${body.errors.field ? ` | ${body.errors.field} is incorrect` : ''}`))
        } else {
          reject(new Error(`An unknown error occurred with getPlaceInfo() | [${statusCode}] placeIds: ${placeIds.join(',')}`))
        }
      }).catch(reject)
  });
}

exports.func = function (args) {
  return getPlaceInfo(args.placeId, args.jar)
}

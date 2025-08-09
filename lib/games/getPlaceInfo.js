// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

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
        jar,
        method: 'GET'
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body)
        } else {
          reject(new RobloxAPIError(res))
        }
      }).catch(reject)
  })
}

exports.func = function (args) {
  return getPlaceInfo(args.placeId, args.jar)
}

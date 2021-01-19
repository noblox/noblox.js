const http = require('../util/http.js').func
const rbxDate = require('../util/getDate.js').func

exports.required = ['placeId']
exports.optional = ['jar']

// Docs
/**
 * Get the info for a place.
 * @category Game
 * @alias getPlaceInfo
 * @param {number} placeId - The id of the place.
 * @returns {Promise<PlaceInformation>}
 * @example const noblox = require("noblox.js")
 * const placeInfo = await noblox.getPlaceInfo(8765432)
**/

function getPlaceInfo (placeId, jar) {
  const httpOpt = {
    url: `//www.roblox.com/places/api-get-details?assetId=${placeId}`,
    options: {
      resolveWithFullResponse: true,
      jar: jar,
      method: 'GET'
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body)
        const created = rbxDate({ time: body.Created, timezone: 'CT' })
        const updated = rbxDate({ time: body.Updated, timezone: 'CT' })

        delete body.Created
        delete body.Updated
        return {
          ...body,
          Created: created,
          Updated: updated
        }
      } else if (res.statusCode === 400) {
        throw new Error('Game does not exist')
      } else {
        throw new Error(`An unexpected error occurred with status code ${res.statusCode}`) // Status Code 5XX
      }
    })
}

exports.func = function (args) {
  return getPlaceInfo(args.placeId, args.jar)
}

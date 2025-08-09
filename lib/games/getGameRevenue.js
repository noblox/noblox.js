const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['placeId', 'type', 'granularity']
exports.optional = ['jar']

/**
 * 🔐 Get the Game Revenue data.
 * @category Game
 * @alias getGameRevenue
 * @param {number} placeId - The id of the game.
 * @param {"Revenue" | "RevenuePerVisit" | "AverageVisitLength" | "Visits"} type - The type of revenue. Options: Revenue, RevenuePerVisit, AverageVisitLength, Visits
 * @param {"Hourly" | "Daily" | "Monthly"} granularity - The type of revenue. Options: Hourly, Daily, Monthly
 * @returns {Promise<GameRevenueResponse>}
 * @example const noblox = require("noblox.js")
 * const gameRevenue = await noblox.getGameRevenue(936068308, "Revenue", "Hourly");
**/

function getGameRevenue (placeId, type, granularity, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//develop.roblox.com/v1/places/${placeId}/stats/${type}?granularity=${granularity}`,
      options: {
        method: 'GET',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) resolve(JSON.parse(res.body))
        else reject(new RobloxAPIError(res))
      })
      .catch(function (err) { console.error(err); reject(err) })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return getGameRevenue(args.placeId, args.type, args.granularity, jar, xcsrf)
    })
}

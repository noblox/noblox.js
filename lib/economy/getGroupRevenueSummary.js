// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['groupId']
exports.optional = ['timeFrame', 'jar']

// Docs
/**
 * 🔐 Gets recent Robux revenue summary for a group; shows pending Robux. | Requires "Spend group funds" permissions.
 * @category Group
 * @alias getGroupRevenueSummary
 * @param {number} groupId - The group id to get Robux summary for.
 * @param {("Day" | "Week" | "Month" | "Year")=} [timeFrame="Month"] - The time frame to get for.
 * @returns {Promise<RevenueSummaryResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * let revenueSummary = await noblox.getGroupRevenueSummary(9997719, "Year")
**/

// Define
function getGroupRevenueSummary (group, timeFrame, jar) {
  return http({
    url: `//economy.roblox.com/v1/groups/${group}/revenue/summary/${timeFrame}`,
    options: {
      jar,
      resolveWithFullResponse: true
    }
  })
    .then((res) => {
      if (res.statusCode === 200) {
        return JSON.parse(res.body)
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

exports.func = function ({ groupId, timeFrame = 'Month', jar }) {
  return getGroupRevenueSummary(groupId, timeFrame, jar)
}

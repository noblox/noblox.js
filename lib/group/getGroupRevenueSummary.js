// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['groupId']
exports.optional = ['timeFrame', 'jar']

// Docs
/**
 * Gets recent Robux revenue summary for a group; shows pending Robux. | Requires "Spend group funds" permissions.
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
      jar: jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ statusCode, body }) => {
      const { errors } = JSON.parse(body)
      if (statusCode === 200) {
        return JSON.parse(body)
      } else if (statusCode === 400) {
        throw new Error(`${errors[0].message} | groupId: ${group}, timeFrame: ${timeFrame}`)
      } else if (statusCode === 401) {
        throw new Error(`${errors[0].message} (Are you logged in?) | groupId: ${group}, timeFrame: ${timeFrame}`)
      } else if (statusCode === 403) {
        throw new Error('Insufficient permissions: "Spend group funds" role permissions required')
      } else {
        throw new Error(`An unknown error occurred with getGroupFunds() | [${statusCode}] groupId: ${group}, timeFrame: ${timeFrame}`)
      }
    })
}

exports.func = function ({ groupId, timeFrame = 'Month', jar }) {
  return getGroupRevenueSummary(groupId, timeFrame, jar)
}

// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group']
exports.optional = ['jar']

// Docs
/**
 * 🔓 Gets the amount of robux in a group.
 * @category Group
 * @alias getGroupFunds
 * @param {number} group - The id of the group
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie (optional if group funds are public)
 * let robux = await noblox.getGroupFunds(9997719)
**/

// Define
function getGroupFunds (group, jar) {
  return http({
    url: `//economy.roblox.com/v1/groups/${group}/currency`,
    options: {
      jar,
      resolveWithFullResponse: true
    }
  })
    .then((res) => {
      const { robux } = JSON.parse(res.body)
      if (res.statusCode === 200) {
        return robux
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

exports.func = function ({ group, jar }) {
  return getGroupFunds(group, jar)
}

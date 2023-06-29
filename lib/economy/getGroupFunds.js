// Includes
const http = require('../util/http.js').func

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
      jar: jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ status, data: resData }) => {
      const { robux, errors } = resData
      if (status === 200) {
        return robux
      } else if (status === 400 || status === 403) {
        throw new Error(`${errors[0].message} | groupId: ${group}`)
      } else {
        throw new Error(`An unknown error occurred with getGroupFunds() | [${status}] groupId: ${group}`)
      }
    })
}

exports.func = function ({ group, jar }) {
  return getGroupFunds(group, jar)
}

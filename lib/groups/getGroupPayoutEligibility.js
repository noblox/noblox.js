// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['group', 'member']
exports.optional = ['jar']

// Docs
/**
 * 🔓 Get if a user can be paid from group funds.
 * @category Group
 * @alias getGroupPayoutEligibility
 * @param {number} group - The id of the group.
 * @param {number} member - The member to check payout status for.
 * @returns {Promise<PayoutAllowedList>}
 * @example const noblox = require("noblox.js")
 * const payoutStatus = await noblox.getGroupPayoutEligibility(1)
 **/

// Define
function getGroupPayoutEligibility (group, member, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://economy.roblox.com/v1/groups/${group}/users-payout-eligibility?userIds=${member}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          reject(new Error(responseData.errors[0].message))
        } else {
          resolve(responseData)
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getGroupPayoutEligibility(args.group, args.member, args.jar)
}

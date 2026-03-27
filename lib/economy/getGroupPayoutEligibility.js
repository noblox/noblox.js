// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group', 'members']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get if a user can be paid from group funds.
 * @category Group
 * @alias getGroupPayoutEligibility
 * @param {number} group - The id of the group.
 * @param {number[]} members - The members to check payout status for.
 * @returns {Promise<PayoutAllowedList>}
 * @example const noblox = require("noblox.js")
 * // Log in with cookie
 * const payoutStatus = await noblox.getGroupPayoutEligibility(1, [2])
 **/

// Define
function getGroupPayoutEligibility (group, members, jar) {
  const memberList = []

  for (const member of members) {
    memberList.push(`userIds=${member}`)
  }

  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://economy.roblox.com/v1/groups/${group}/users-payout-eligibility?${memberList.join('&')}`,
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
          reject(new RobloxAPIError(res))
        } else {
          resolve(responseData)
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getGroupPayoutEligibility(args.group, args.members, args.jar)
}

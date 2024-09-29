// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['group', 'member']
exports.optional = []

// Docs
/**
 * 🔓 Get if a user can be paid from group funds.
 * @category Group
 * @alias canPay
 * @param {number} group - The id of the group.
 * @param {number} member - The member to check payout status for.
 * @returns {Promise<PayoutAllowedList>}
 * @example const noblox = require("noblox.js")
 * const groupShout = await noblox.getShout(1)
 **/

// Define
function getShout (group, member, jar) {
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
                if (res.statusCode === 400) {
                    reject(new Error('The group is invalid or does not exist.'))
                }
                if (responseData.shout === null) {
                    reject(new Error('You do not have permissions to view the shout for the group.'))
                } else {
                    resolve(responseData.shout)
                }
            })
            .catch(error => reject(error))
    })
}

exports.func = function (args) {
    return getShout(args.group, args.jar)
}

// Includes
const http = require('../util/http').func

// Args
exports.required = ['userId', 'badgeId']

// Docs
/**
 * ✅ Get the time the badge was awarded to a user.
 * @category Badges
 * @alias getAwardedTimestamps
 * @param {number} userId - The userId of the user.
 * @param {Array<number>} badgeId - The ids of the badges.
 * @returns {Promise<UserBadgeStats>}
 * @example const noblox = require("noblox.js")
 * const badges = await noblox.getAwardedTimestamps(1, [1, 2, 3])
**/

// Define
const getAwardedTimestamps = (userId, badgeId) => {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${badgeId.join(',')}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = res.body
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve(responseData)
        }
      })
  })
}

exports.func = async (args) => {
  if (isNaN(args.userId)) {
    throw new Error('The provided User ID is not a number.')
  }

  return getAwardedTimestamps(args.userId, args.badgeId)
}

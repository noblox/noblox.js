// Includes
const http = require('../util/http').func

// Args
exports.required = ['userId', 'badgeIds']

// Docs
/**
 * ✅ Get the time the badge was awarded to a user.
 * @category Badges
 * @alias getAwardedTimestamps
 * @param {number} userId - The userId of the user.
 * @param {number|Array<number>} badgeIds - The id or ids of badges (up to 100).
 * @returns {Promise<UserBadgeStats[]>}
 * @example const noblox = require("noblox.js")
 * const badges = await noblox.getAwardedTimestamps(1, [1, 2, 3])
**/

// Define
const getAwardedTimestamps = (userId, badgeIds) => {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://badges.roblox.com/v1/users/${userId}/badges/awarded-dates?badgeIds=${badgeIds.join(',')}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve(responseData.data.map(obj => {
            obj.awardedDate = new Date(obj.awardedDate)
            return obj
          }))
        }
      })
  })
}

exports.func = async ({ userId, badgeIds }) => {
  if (isNaN(userId)) {
    throw new Error('The provided userId is not a number.')
  }

  if (typeof badgeIds === 'number') {
    badgeIds = [badgeIds]
  }

  if (!Array.isArray(badgeIds) || badgeIds.some(isNaN)) {
    throw new Error('The provided badgeIds were not a number or array of numbers.')
  }

  if (badgeIds.length > 100) {
    throw new Error('Too many badgeIds were provided (max 100)')
  }

  return getAwardedTimestamps(userId, badgeIds)
}

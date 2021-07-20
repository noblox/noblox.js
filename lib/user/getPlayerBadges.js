// Includes
const http = require('../util/http').func

// Args
exports.required = ['userId']
exports.optional = ['limit', 'cursor', 'sortOrder']

// Docs
/**
 * ✅ Get the badges that a user has.
 * @category User
 * @alias getPlayerBadges
 * @param {number} userId - The id of the user whose badges are being fetched.
 * @param {Limit=} [limit=10] - The amount of badges being returned each request.
 * @param {string=} cursor - The cursor of the previous or next page.
 * @param {SortOrder=} [sortOrder=Asc] - The order that the data will be returned in (Asc or Desc)
 * @returns {Promise<PlayerBadges>}
 * @example const noblox = require("noblox.js")
 * let badges = noblox.getPlayerBadges(123456, 10, "1684988462_1_29fbf93fdfb5b3f74d205ec09681c970", "Asc")
**/

// Define
const playerBadges = (userId, limit, cursor, sortOrder) => {
  return http({
    url: `https://badges.roblox.com/v1/users/${userId}/badges?limit=${limit}&cursor=${cursor}&sortOrder=${sortOrder}`,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }).then(res => {
    if (res.statusCode === 200) {
      const json = JSON.parse(res.body)
      const out = []
      for (const badge of json.data) {
        const modifiedBadge = { ...badge }
        modifiedBadge.updated = new Date(badge.updated)
        modifiedBadge.created = new Date(badge.created)
        out.push(modifiedBadge)
      }
      return out
    } else {
      throw new Error('User is invalid or does not exist.')
    }
  })
}

exports.func = async (args) => {
  if (isNaN(args.userId)) {
    throw new Error('The provided User ID is not a number.')
  }
  if (args.limit) {
    if (![10, 25, 50, 100].includes(args.limit)) {
      throw new Error('The allowed values are: 10, 25, 50 and 100.')
    }
  }
  if (args.sortOrder) {
    if (args.sortOrder.toLowerCase() !== 'asc' && args.sortOrder.toLowerCase() !== 'desc') {
      throw new Error('Invalid sort order type.')
    }
  }
  const limit = args.limit || 10
  const sortOrder = args.sortOrder || 'Asc'
  const cursor = args.cursor || ''
  return playerBadges(args.userId, limit, cursor, sortOrder)
}

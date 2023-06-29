// Includes
const http = require('../util/http').func

// Args
exports.required = ['badgeId']

// Docs
/**
 * ✅ Get the info of a badge.
 * @category Badges
 * @alias getBadgeInfo
 * @param {number} badgeId - The badge's id.
 * @returns {Promise<BadgeInfo>}
 * @example const noblox = require("noblox.js")
 * const badgeInfo = await noblox.getBadgeInfo(1)
**/

// Define
const badgeInfo = async (id) => {
  return http({
    url: `https://badges.roblox.com/v1/badges/${id}`,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }).then(res => {
    if (res.status === 200) {
      const json = res.data
      json.created = new Date(json.created)
      json.updated = new Date(json.updated)
      return json
    } else {
      throw new Error('Badge is invalid or does not exist.')
    }
  })
}

exports.func = async (args) => {
  if (isNaN(args.badgeId)) {
    throw new Error('The provided Badge ID is not a number.')
  }
  return badgeInfo(args.badgeId)
}

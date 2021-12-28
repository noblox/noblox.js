// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['userId']
exports.optional = ['limit', 'sortOrder', 'jar']

// Docs
/**
 * ✅ Get the badges that a user has.
 * @category User
 * @alias getPlayerBadges
 * @param {number} userId - The id of the user whose badges are being fetched.
 * @param {number} [limit=10] - The amount of badges being returned each request.
 * @param {SortOrder=} [sortOrder=Asc] - The order that the data will be returned in (Asc or Desc)
 * @returns {Promise<Array<PlayerBadges>>}
 * @example const noblox = require("noblox.js")
 * let badges = noblox.getPlayerBadges(123456, 10, "Asc")
**/

exports.func = async (args) => {
  return getPageResults({
    jar: args.jar,
    url: `//badges.roblox.com/v1/users/${args.userId}/badges`,
    sortOrder: args.sortOrder,
    limit: args.limit
  })
}

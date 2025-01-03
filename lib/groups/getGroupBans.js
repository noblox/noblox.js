// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['groupId']
exports.optional = ['limit', 'sortOrder', 'pageCursor', 'jar']

// Docs
/**
 * 🔐 Gets bans of a group
 * @category Group
 * @alias getGroupBans
 * @param {number} groupId - The ID of the group
 * @param {Limit=} limit - The number of bans to fetch maximum per page
 * @param {SortOrder=} sortOrder - The order to sort the bans
 * @param {string=} pageCursor - The next or previous page's cursor
 * @returns {Promise<{ previousPageCursor?: string, nextPageCursor?: string, data: GroupBan[] }>}
 * @example const noblox = require("noblox.js")
 * await noblox.getGroupBans({ groupId: 1, limit: 100, sortOrder: "Desc" })
**/

// Define
exports.func = async function (args) {
  let { groupId, jar, limit, pageCursor, sortOrder } = args
  limit ||= 100
  sortOrder ||= 'Desc'

  return await getPageResults({
    url: `//groups.roblox.com/v1/groups/${groupId}/bans`,
    query: {
      sortOrder
    },
    pageCursor,
    limit,
    jar
  })
}

// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['keyword']
exports.optional = ['prioritizeExactMatch', 'limit']

// Docs
/**
 * ✅ Searches for groups by a given search term.
 * @category Group
 * @alias searchGroups
 * @param {string} keyword - The keyword or search term to search by.
 * @param {boolean} [true] prioritizeExactMatch - Whether or not to prioritize the exact match for the keyword
 * @param {Limit=} [limit=∞] - The maximum number of groups to return
 * @returns {Promise<GroupSearchItem[]>}
 * @example const noblox = require("noblox.js")
 * const groupInfo = await noblox.searchGroups("noblox.js");
 **/

// Define
exports.func = async function (args) {
  const results = await getPageResults({
    url: '//groups.roblox.com/v1/groups/search',
    query: { keyword: args.keyword, prioritizeExactMatch: args.prioritizeExactMatch || false },
    sortOrder: args.sortOrder || 'Asc',
    limit: args.limit
  })
  // Parse updated/created to Date objects.
  return results.map((g) => ({ created: new Date(g.created), updated: new Date(g.updated), ...g }))
}

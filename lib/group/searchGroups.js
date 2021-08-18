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
 * @param {boolean} [false] prioritizeExactMatch - Whether or not to prioritize the exact match for the keyword
 * @param {number} [100] - The maximum number of groups to return. Supply 0 to apply no limit, returning all results.
 * Note: This may significantly increase the time to execute and return potentially thousands of results.
 * @returns {Promise<GroupSearchItem[]>}
 * @example const noblox = require("noblox.js")
 * const groupInfo = await noblox.searchGroups("noblox.js");
 **/

// Define
exports.func = async function (args) {
  const results = await getPageResults({
    url: '//groups.roblox.com/v1/groups/search',
    query: { keyword: args.keyword, prioritizeExactMatch: args.prioritizeExactMatch || false },
    // If limit is 0, pass undefined for infinite results. Otherwise, default to 100.
    limit: args.limit === 0 ? undefined : (args.limit || 100)
  })
  // Parse updated/created to Date objects.
  return results.map((g) => ({ created: new Date(g.created), updated: new Date(g.updated), ...g }))
}

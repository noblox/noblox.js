// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['keyword']
exports.optional = ['limit', 'cursor']

// Docs
/**
 * ✅ Gets a list of users matching the keyword
 * @category User
 * @alias searchUsers
 * @param {string} keyword - The search term to use
 * @param {10 | 25 | 50 | 100} limit - The maximum number of matching users to return
 * @param {string} cursor - The cursor to use when fetching the next or previous page
 * @returns {Promise<UserSearchResult[]>}
 * @example const noblox = require("noblox.js")
 * // Log in using cookie
 * await noblox.searchUsers("bob", 10, "cursorstring")
**/

// Define
function searchUsers (jar, keyword, limit, cursor) {
  return getPageResults({
    url: '//users.roblox.com/v1/users/search',
    jar,
    limit,
    pageCursor: cursor,
    query: {
      keyword
    }
  })
}

exports.func = function (args) {
  return searchUsers(
    args.jar,
    args.keyword,
    args.limit ?? 10,
    args.cursor
  )
}

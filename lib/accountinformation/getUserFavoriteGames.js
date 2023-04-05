// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ["accessFilter", "limit", "cursor", "sortOrder"]

// Docs
/**
 * ✅ Get the favorite games data.
 * @category AccountInformation
 * @alias getUserFavoriteGames
 * @param {number} userId - The id of the user.
 * @param {number} accessFilter - Filtering option via access level.
 * @param {number} limit - The number of results per request.
 * @param {string} cursor - The paging cursor for the previous or next page.
 * @param {string} sortOrder - The order the results are sorted in.
 * @returns {Promise<object>}
 * @example 
 * const noblox = require("noblox.js")
 * const userSocialLinks = await noblox.getUserFavoriteGames(172694510);
**/

function getUserFavoriteGames(userId, accessFilter, limit, cursor, sortOrder) {
  return http({
    url: `//games.roblox.com/v2/users/${userId}/favorite/games?accessFilter=${accessFilter ?? 2}&limit=${limit ?? 10}&cursor=${cursor ?? ""}&sortOrder=${sortOrder ?? ""}`,
    options: {
      method: "GET"
    }
  }).then((res) => {
    const body = JSON.parse(res);
    if (body.errors) {
      var errors = new Array();
      for (const error of body.errors) {
        errors.push(`[${error.code}] ${error.message}`)
      }
      throw new Error(`Errors Found:\n  ${errors.join("\n  ")}\n`);
    }
    else {
      return body;
    }
  })
}

exports.func = function ({ userId, accessFilter, limit, cursor, sortOrder }) {
  return getUserFavoriteGames(userId, accessFilter, limit, cursor, sortOrder);
}

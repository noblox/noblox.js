// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']

// Docs
/**
 * ✅ Get a user's DevForum information from their id.
 * @category User
 * @alias getDevForumInfo
 * @param {number} userId - The username of the account whose id is being fetched.
 * @returns {Promise<DevForumInfo>}
 * @example const noblox = require("noblox.js")
 * const data = await noblox.getDevForumInfo(23245321)
**/

// Define
function getDevInfo (userId) {
  const httpOpt = {
    url: `//devforum.roblox.com/u/by-external/${userId}.json`
  }
  return http(httpOpt)
    .then(function (body) {
      const json = JSON.parse(body)
      const error = json.errors
      if (!error) {
        return json
      } else {
        return error
      }
    })
}

exports.func = function (args) {
  const userId = args.userId
  return getDevInfo(userId)
}

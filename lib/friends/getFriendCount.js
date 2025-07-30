// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']

// Docs
/**
 * ✅ Gets the number of friends a user has.
 * @category User
 * @alias getFriendCount
 * @param { number } userId
 * @returns Promise<number>
 * @example const noblox = require("noblox.js")
 * const numberOfFriends = await noblox.getFriendCount(55549140)
**/

// Define
exports.func = function (args) {
  const httpOpt = {
    url: `//friends.roblox.com/v1/users/${args.userId}/friends/count`,
    options: {
      json: true,
      method: 'GET',
      resolveWithFullResponse: true
    }
  }

  return http(httpOpt).then(function (res) {
    if (res.statusCode === 200) { return res.body.count }

    throw new RobloxAPIError(res)
  })
}

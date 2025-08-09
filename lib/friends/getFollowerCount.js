// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['userId']

// Docs
/**
 * ✅ Gets the number of followers a user has.
 * @category User
 * @alias getFollowerCount
 * @param { number } userId
 * @returns Promise<number>
 * @example const noblox = require("noblox.js")
 * const numberOfFollowers = await noblox.getFollowerCount(55549140)
**/

// Define
exports.func = function (args) {
  const httpOpt = {
    url: `//friends.roblox.com/v1/users/${args.userId}/followers/count`,
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

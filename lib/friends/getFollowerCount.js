// Includes
const http = require('../util/http.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

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
function getFollowerCount(jar, userId) {
  const httpOpt = {
    url: `//friends.roblox.com/v1/users/${userId}/followers/count`,
    options: {
      jar,
      json: true,
      method: 'GET',
      resolveWithFullResponse: true
    }
  }

  return http(httpOpt).then(function (res) {
    if (res.statusCode === 200)
      return res.body.count

    throw new Error(
      `Failed to retrieve follower count: (${res.statusCode}) ${res.body}`
    )
  })
}

exports.func = function (args) {
  return getFollowerCount(args.jar, args.userId)
}

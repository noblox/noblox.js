// Includes
const http = require('../util/http.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * ✅ Gets the number of users a user is following.
 * @category User
 * @alias getFollowingCount
 * @param { number } userId
 * @returns Promise<number>
 * @example const noblox = require("noblox.js")
 * const numberOfFollowings = await noblox.getFollowingCount(55549140)
**/

// Define
function getFollowingCount(jar, userId) {
  const httpOpt = {
    url: `//friends.roblox.com/v1/users/${userId}/followings/count`,
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
      `Failed to retrieve following count: (${res.statusCode}) ${res.body}`
    )
  })
}

exports.func = function (args) {
  return getFollowingCount(args.jar, args.userId)
}

// Includes
const http = require('../util/http.js')

// Args
exports.required = ['userId']
exports.optional = ['jar']

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
function getFriendCount(jar, userId) {
  const httpOpt = {
    url: `//friends.roblox.com/v1/users/${userId}/friends/count`,
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
      `Failed to retrieve friend count: (${res.statusCode}) ${res.body}`
    )
  })
}

exports.func = function (args) {
  return getFriendCount(args.jar, args.userId)
}

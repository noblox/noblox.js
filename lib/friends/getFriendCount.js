// Includes
const http = require('../util/http.js').func

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
exports.func = function (userId) {
  const httpOpt = {
    url: `//friends.roblox.com/v1/users/${userId}/friends/count`,
    options: {
      json: true,
      method: 'GET',
      resolveWithFullResponse: true
    }
  }

  return http(httpOpt).then(function (res) {
    if (res.statusCode === 200) { return res.body.count }

    throw new Error(
      `Failed to retrieve friend count: (${res.statusCode}) ${JSON.stringify(res.body)}`
    )
  })
}

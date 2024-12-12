// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']

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
exports.func = function (userId) {
  const httpOpt = {
    url: `//friends.roblox.com/v1/users/${userId}/followings/count`,
    options: {
      json: true,
      method: 'GET',
      resolveWithFullResponse: true
    }
  }

  return http(httpOpt).then(function (res) {
    if (res.statusCode === 200) { return res.body.count }

    throw new Error(
      `Failed to retrieve following count: (${res.statusCode}) ${res.body}`
    )
  })
}

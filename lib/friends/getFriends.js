// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')
// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * ✅ Get the friends of a user
 * @category User
 * @alias getFriends
 * @param {number} userId - The id of the user whose friends are being returned.
 * @returns {Promise<Friends>}
 * @example const noblox = require("noblox.js")
 * let friends = await noblox.getFriends(123456)
**/

// Define
function getFriends (jar, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//friends.roblox.com/v1/users/${userId}/friends`,
      options: {
        method: 'GET',
        jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          const response = JSON.parse(res.body)
          response.data = response.data.map((entry) => {
            entry.created = new Date(entry.created)
            return entry
          })
          resolve(response)
        } else {
          reject(new RobloxAPIError(res))
        }
      })
  })
}

exports.func = function (args) {
  return getFriends(args.jar, args.userId)
}

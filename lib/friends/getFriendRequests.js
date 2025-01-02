// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = []
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

// Docs
/**
 * 🔐 Get the friend requests of the authenticated user.
 * @category User
 * @alias getFriendRequests
 * @param {SortOrder=} [sortOrder=Asc] - The order of the returned data (Asc or Desc)
 * @param {Limit=} [limit=10] - The number of users returned by each request.
 * @param {string=} cursor - The previous or next page's cursor.
 * @returns {Promise<FriendRequestsPage>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * let friendRequests = await noblox.getFriendRequests({sortOrder: "Desc", limit: 100})
**/

// Define
function getFriendsRequests (args) {
  return new Promise((resolve, reject) => {
    const jar = args.jar
    const httpOpt = {
      url: '//friends.roblox.com/v1/my/friends/requests',
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

exports.func = getFriendsRequests

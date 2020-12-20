// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

// Docs
/**
 * Get the users followed by the user.
 * @category User
 * @alias getFollowings
 * @param {number} userId - The id of the user.
 * @param {Limit=} [limit=10] - The amount of users fetched by each request (10, 25, 50, 100)
 * @param {SortOrder=} [sortOrder=Asc] - The order that the returned data will be sorted by (Asc or Desc)
 * @param {string=} cursor - The previous or next page's cursor.
 * @returns {Promise<FollowingsPage>}
 * @example const noblox = require("noblox.js")
 * let following = await noblox.getFollowings(123456, "Asc", 50)
**/

// Define
function getFollowings (jar, userId, sortOrder, limit, cursor) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//friends.roblox.com/v1/users/${userId}/followings?limit=${limit}&sortOrder=${sortOrder}&cursor=${cursor}`,
      options: {
        method: 'GET',
        jar: jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body))
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  const sortOrder = args.sortOrder || 'Asc'
  const limit = args.limit || (10).toString()
  const cursor = args.cursor || ''
  return getFollowings(jar, args.userId, sortOrder, limit, cursor)
}

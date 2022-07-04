// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

// Docs
/**
 * ✅ Get a user's followers.
 * @category User
 * @alias getFollowers
 * @param {number} userId - The id of the user whose followers are being returned.
 * @param {Limit=} [limit=10] - The amount of followers being fetched each request.
 * @param {SortOrder=} [sortOrder=Asc] - The order that the data should be sorted by (Asc or Desc)
 * @param {string=} cursor - The cursor for the previous or next page.
 * @returns {Promise<FollowersPage>}
 * @example const noblox = require("noblox.js")
 * let followers = await noblox.getFollowers(123456, "Asc", 10)
**/

// Define
function getFollowers (jar, userId, sortOrder, limit, cursor) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//friends.roblox.com/v1/users/${userId}/followers?limit=${limit}&sortOrder=${sortOrder}&cursor=${cursor}`,
      options: {
        method: 'GET',
        jar: jar,
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
  return getFollowers(jar, args.userId, sortOrder, limit, cursor)
}

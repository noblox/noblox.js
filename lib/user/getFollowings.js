// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

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

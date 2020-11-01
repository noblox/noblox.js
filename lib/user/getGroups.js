// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * Get the groups of a user.
 * @category User
 * @alias getGroups
 * @param {number} userId - The id of the user.
 * @returns {Promise<Group[]>}
 * @example const noblox = require("noblox.js")
 * let groups = await noblox.getGroups(123456)
**/

// Define
function getGroups (jar, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//api.roblox.com/users/${userId}/groups`,
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

exports.func = function (args, senderUserId) {
  const jar = args.jar
  return getGroups(jar, args.userId)
}

// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['username']

// Docs
/**
 * ✅ Get a user's id from their username.
 * @category User
 * @alias getIdFromUsername
 * @param {string} username - The username of the account whose id is being fetched.
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * let id = await noblox.getIdFromUsername("ROBLOX")
**/

// Define
function getIdFromUsername (username) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//users.roblox.com/v1/usernames/users',
      options: {
        method: 'POST',
        json: {
          usernames: [ username ],
          excludeBannedUsers: false
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function ({ statusCode, body }) {
        if (statusCode === 200) {
          const userId = body.data && body.data[0] && body.data[0].id
  
          if (userId) {
            resolve(userId)
          } else {
            reject("User not found")
          }
        } else if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => e.message)
            reject(new Error(`${statusCode} ${errors.join(', ')}`))
        } else {
          reject(new Error(`${statusCode} ${body}`))
        }
      })
  })
}

exports.func = function (args) {
  const username = args.username
  // Case does not affect the result and should not affect the cache
  return cache.wrap('IDFromName', username.toLowerCase(), function () {
    return getIdFromUsername(username)
  })
}

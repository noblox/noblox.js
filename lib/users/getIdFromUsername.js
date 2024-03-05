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
 * @param {string | string[]} usernames - The username or usernames of the account(s) whose id(s) is being fetched.
 * @returns {Promise<number> | Promise<number[]>}
 * @example const noblox = require("noblox.js")
 * let ids = await noblox.getIdFromUsername(["ROBLOX", "Qxest", "builderman"])
**/

// Define
function getIdFromUsername (usernames) {
  usernames = Array.isArray(usernames) ? usernames : [usernames] // cast usernames to array if necessary

  const httpOpt = {
    url: 'https://users.roblox.com/v1/usernames/users',
    options: {
      method: 'POST',
      json: {
        usernames,
        excludeBannedUsers: false
      }
    }
  }
  return http(httpOpt)
    .then(function (body) {
      const data = body.data

      let results = usernames.map((username) => {
        return data.find((result) => result.requestedUsername === username.toLowerCase()) // roblox lowercases requestedUsername, causing issues when the provided username is not lowercase
      })

      results = results.map((result) => result !== undefined ? result.id : null)

      return results.length > 1 ? results : results[0]
    })
}

exports.func = function (args) {
  const usernames = Array.isArray(args.username) ? args.username : [args.username] // cast usernames to array if necessary
  // Case does not affect the result and should not affect the cache
  return cache.wrap('IDFromName', usernames.map(username => username.toLowerCase()), function () {
    return getIdFromUsername(usernames)
  })
}

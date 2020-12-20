// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['username']

// Docs
/**
 * Get a user's id from their username.
 * @category User
 * @alias getIdFromUsername
 * @param {string} username - The username of the account whose id is being fetched.
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * let id = await noblox.getIdFromUsername("ROBLOX")
**/

// Define
function getIdFromUsername (username) {
  const httpOpt = {
    url: '//api.roblox.com/users/get-by-username?username=' + username
  }
  return http(httpOpt)
    .then(function (body) {
      const json = JSON.parse(body)
      const id = json.Id
      const errorMessage = json.errorMessage
      const message = json.message
      if (id) {
        return id
      } else if (errorMessage || message) {
        throw new Error(errorMessage || message)
      }
    })
}

exports.func = function (args) {
  const username = args.username
  // Case does not affect the result and should not affect the cache
  return cache.wrap('IDFromName', username.toLowerCase(), function () {
    return getIdFromUsername(username)
  })
}

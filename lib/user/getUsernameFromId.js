// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['id']

// Docs
/**
 * ✅ Get a user's username from their user id.
 * @category User
 * @alias getUsernameFromId
 * @param {number} id - The id of the user.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * let username = await noblox.getUsernameFromId(123456)
**/

// Define
function getUsernameFromId (id) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://users.roblox.com/v1/users/${id}`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET',
        json: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        // Sourced from: https://stackoverflow.com/a/32278428
        const isAnObject = (val) => !!(val instanceof Array || val instanceof Object)
        const body = isAnObject(res.body) ? res.body : {}

        if (res.statusCode === 200) {
          resolve(body.name)
        } else if (body.errors && body.errors.length > 0) {
          const errors = body.errors.map((e) => e.message)
          reject(new Error(`${statusCode} ${errors.join(', ')}`))
        } else {
          reject(new Error(`${res.statusCode} An error has occurred ${res.body ? res.body : ''}`))
        }
      })
  })
}

exports.func = function (args) {
  const id = args.id
  return cache.wrap('NameFromID', id, function () {
    return getUsernameFromId(id)
  })
}

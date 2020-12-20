// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['id']

// Docs
/**
 * Get a user's username from their user id.
 * @category User
 * @alias getUsernameFromId
 * @param {number} id - The id of the user.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * let username = await noblox.getUsernameFromId(123456)
**/

// Define
function getUsernameFromId (id) {
  const httpOpt = {
    url: '//api.roblox.com/users/' + id,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        const json = JSON.parse(res.body)
        return json.Username
      } else {
        throw new Error('User does not exist')
      }
    })
}

exports.func = function (args) {
  const id = args.id
  return cache.wrap('NameFromID', id, function () {
    return getUsernameFromId(id)
  })
}

// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['id']

// Docs
/**
 * ✅ Get a user's displayname from their user id.
 * @category User
 * @alias getDisplaynameFromId
 * @param {number} id - The id of the user.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * let displayname = await noblox.getDisplaynameFromId(123456)
**/

// Define
function getDisplaynameFromId (id) {
  const httpOpt = {
    url: '//users.roblox.com/v1/users/' + id,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        const json = JSON.parse(res.body)
        return json.displayName
      } else {
        throw new Error('User does not exist')
      }
    })
}

exports.func = function (args) {
  const id = args.id
  return cache.wrap('NameFromID', id, function () {
    return getDisplaynameFromId(id)
  })
}

// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['universeId', 'isPublic']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Modifies a universe's public access setting
 * @category Game
 * @alias updateUniverseAccess
 * @param {number} universeId - The universeId of the experience
 * @param {boolean=} isPublic - The visibility and access of the universe; shuts down all running instances if set to false
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.updateUniverseAccess(2421261122, true)
**/

// Define
function updateUniverseAccess (universeId, isPublic, jar, token) {
  return new Promise((resolve, reject) => {
    return http({
      url: `//develop.roblox.com/v1/universes/${universeId}/${isPublic ? 'activate' : 'deactivate'}`,
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          universeId
        },
        resolveWithFullResponse: true
      }
    }).then(({ statusCode, body }) => {
      if (statusCode === 200) {
        resolve()
      } else if (body && body.errors) {
        reject(new Error(`[${statusCode}] ${body.errors[0].message} | universeId: ${universeId}, isPublic: ${isPublic} ${body.errors.field ? ` | ${body.errors.field} is incorrect` : ''}`))
      } else {
        reject(new Error(`An unknown error occurred with updateUniverseAccess() | [${statusCode}] universeId: ${universeId}, isPublic: ${isPublic}`))
      }
    })
  })
}

exports.func = function ({ universeId, isPublic, jar }) {
  return getGeneralToken({ jar })
    .then((token) => {
      return updateUniverseAccess(universeId, isPublic, jar, token)
    })
}

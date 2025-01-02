// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['universeId', 'isPublic']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Modifies a universe's public access setting
 * @category Develop
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
    }).then((res) => {
      if (res.statusCode === 200) {
        resolve()
      } else {
        reject(new RobloxAPIError(res))
      }
    }).catch(error => reject(error))
  })
}

exports.func = function ({ universeId, isPublic, jar }) {
  return getGeneralToken({ jar })
    .then((token) => {
      return updateUniverseAccess(universeId, isPublic, jar, token)
    })
}

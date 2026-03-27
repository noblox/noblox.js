// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['universeId', 'settings']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Modifies a universe's settings
 * @category Develop
 * @alias updateUniverse
 * @param {number} universeId - The universeId of the experience
 * @param {UniverseSettings} settings - The settings to update
 * @returns {Promise<UpdateUniverseResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.updateUniverse(2421261122, { name: "The best game ever!" })
**/

// Define
function updateUniverse (universeId, settings, jar, token) {
  return new Promise((resolve, reject) => {
    return http({
      url: `//develop.roblox.com/v1/universes/${universeId}/configuration`,
      options: {
        method: 'PATCH',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: settings,
        resolveWithFullResponse: true
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        resolve(res.body)
      } else {
        reject(new RobloxAPIError(res))
      }
    }).catch(reject)
  })
}

exports.func = function ({ universeId, settings, jar }) {
  return getGeneralToken({ jar })
    .then((token) => {
      return updateUniverse(universeId, settings, jar, token)
    })
}

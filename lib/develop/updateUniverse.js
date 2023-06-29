// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

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
    }).then(({ status, data: resData }) => {
      if (status === 200) {
        resolve(resData)
      } else if (resData && resData.errors) {
        reject(new Error(`[${status}] ${resData.errors[0].message} | universeId: ${universeId}, settings: ${JSON.stringify(settings)} ${resData.errors.field ? ` | ${resData.errors.field} is incorrect` : ''}`))
      } else {
        reject(new Error(`An unknown error occurred with updateUniverse() | [${status}] universeId: ${universeId}, settings: ${JSON.stringify(settings)}`))
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

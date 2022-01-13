// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['universeId', 'settings']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Modifies a universe's settings
 * @category Game
 * @alias updateUniverse
 * @param {number} universeId - The universeId of the experience
 * @param {UniverseSettings} settings - The settings to update
 * @returns {Promise<UpdateUniverseResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.updateUniverse(2421261122, { name: "The best game ever!" })
**/

// Define
function updateUniverse(universeId, settings, jar, token) {
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
    }).then(({ statusCode, body }) => {
      if (statusCode === 200) {
        resolve(body)
      } else if (body && body.errors) {
        reject(new Error(`[${statusCode}] ${body.errors[0].message} | universeId: ${universeId}, settings: ${JSON.stringify(settings, null, " ")} ${body.errors.field ? ` | ${body.errors.field} is incorrect` : ''}`))
      } else {
        reject(new Error(`An unknown error occurred with updateUniverse() | [${statusCode}] universeId: ${universeId}, settings: ${JSON.stringify(settings, null, " ")}`))
      }
    })
  })
}

exports.func = function ({ universeId, settings, jar }) {
  return getGeneralToken({ jar })
    .then((token) => {
      return updateUniverse(universeId, settings, jar, token)
    })
}

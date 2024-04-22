// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['gamepass']

// Docs
/**
 * ✅ Get the info of an gamepass.
 * @category Asset
 * @param {number} gamePassId - The id of the asset.
 * @returns {Promise<GamePassProductInfo>}
 * @example const noblox = require("noblox.js")
 * const gamePassInfo = await noblox.getGamePassProductInfo(2919875)
**/

// Define
function getGamePassProductInfo (gamepass) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roproxy.com/game-passes/v1/game-passes/${gamepass}/product-info`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET'
      }
    }

    return http(httpOpt)
      .then(function (res) {
        try {
          // First, check the content type
          const contentType = res.headers['content-type']
          if (contentType && contentType.includes('application/json')) {
            const data = JSON.parse(res.body)

            if (res.statusCode === 200) {
              resolve(data)
            } else {
              console.log(data)
              const errors = Array.isArray(data.errors) ? data.errors.map((e) => e.message) : ['Unknown error']
              reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
            }
          } else {
            // If not JSON, handle or log accordingly
            console.error('Non-JSON response received:', res.body) // Log the unexpected body
            reject(new Error('Expected JSON response but received content-type: ' + contentType))
          }
        } catch (error) {
          // Handle JSON parsing errors
          reject(new Error('Failed to parse JSON response: ' + error.message))
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  const gamepass = args.gamepass

  return cache.wrap('GamePassProduct', gamepass, function () {
    return getGamePassProductInfo(gamepass)
  })
}

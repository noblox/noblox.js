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
      url: `//apis.roblox.com/game-passes/v1/game-passes/${gamepass}/product-info`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET'
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const data = JSON.parse(res.body)

        if (res.statusCode === 200) {
          resolve(data)
        } else {
          const errors = data.errors.map((e) => e.message)

          reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
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

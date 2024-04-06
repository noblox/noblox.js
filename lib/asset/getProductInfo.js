// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['asset']

// Docs
/**
 * ✅ Get the info of an asset.
 * @category Asset
 * @param {number} assetId - The id of the asset.
 * @returns {Promise<ProductInfo>}
 * @example const noblox = require("noblox.js")
 * const productInfo = await noblox.getProductInfo(1117747196)
**/

// Define
function getProductInfo (asset) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//economy.roblox.com/v2/assets/${asset}/details`,
      options: {
        resolveWithFullResponse: true,
        method: 'GET'
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body)
        } else {
          // Sourced from: https://stackoverflow.com/a/32278428
          const isAnObject = (val) => !!(val instanceof Array || val instanceof Object)

          const body = isAnObject(res.body) ? res.body : {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          } else {
            reject(new Error(`${res.statusCode} ${res.body}`))
          }
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  const asset = args.asset
  return cache.wrap('Product', asset, function () {
    return getProductInfo(asset)
  })
}

// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['asset']

// Docs
/**
 * Get the info of an asset.
 * @category Assets
 * @param {number} assetId - The id of the asset.
 * @returns {Promise<ProductInfo>}
 * @example const noblox = require("noblox.js")
 * const productInfo = await noblox.getProductInfo(1117747196)
**/

// Define
function getProductInfo (asset) {
  const httpOpt = {
    url: '//api.roblox.com/marketplace/productinfo?assetId=' + asset,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        return JSON.parse(res.body)
      } else {
        throw new Error('Asset does not exist')
      }
    })
}

exports.func = function (args) {
  const asset = args.asset
  return cache.wrap('Product', asset, function () {
    return getProductInfo(asset)
  })
}

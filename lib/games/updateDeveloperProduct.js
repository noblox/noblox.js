const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['universeId', 'productId', 'priceInRobux']
exports.optional = ['name', 'description', 'iconImageAssetId', 'jar']

// Docs
/**
 * 🔐 Update a developer product.
 * @category Game
 * @alias updateDeveloperProduct
 * @param {number} universeId - The id of the universe.
 * @param {number} productId - The id of the product.
 * @param {number} priceInRobux - The new price of the product.
 * @param {string=} name - The new name of the product.
 * @param {string=} description - The new description of the product.
 * @param {iconImageAssetId=} iconImageAssetId - The new icon image asset ID for the product.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.updateDeveloperProduct(1, 2, 10, "An Updated Developer Product", "My new updated product.")
**/

function updateDeveloperProduct (universeId, productId, priceInRobux, name, description, iconImageAssetId, jar, token) {
  return new Promise((resolve, reject) => {
    return http({
      url: `//apis.roblox.com/developer-products/v1/universes/${universeId}/developerproducts/${productId}/update`,
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          Name: name,
          Description: description,
          IconImageAssetId: iconImageAssetId,
          PriceInRobux: priceInRobux
        },
        resolveWithFullResponse: true
      }
    }).then(({ status, resData: data }) => {
      if (status === 200) {
        resolve(data)
      } else if (data && data.errors) {
        reject(new Error(`[${status}] ${data.errors[0].message} | universeId: ${universeId}, data: ${JSON.stringify({
          Name: name,
          Description: description,
          IconImageAssetId: iconImageAssetId,
          PriceInRobux: priceInRobux
        })}`))
      } else {
        reject(new Error(`An unknown error occurred with updateDeveloperProduct() | [${status}] universeId: ${universeId}, data: ${JSON.stringify({
          Name: name,
          Description: description,
          IconImageAssetId: iconImageAssetId,
          PriceInRobux: priceInRobux
        })}`))
      }
    }).catch(reject)
  })
}

exports.func = function ({ universeId, productId, priceInRobux, name, description, iconImageAssetId, jar }) {
  return getGeneralToken({ jar })
    .then((token) => {
      return updateDeveloperProduct(universeId, productId, priceInRobux, name, description, iconImageAssetId, jar, token)
    })
}

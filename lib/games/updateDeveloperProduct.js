const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['universeId', 'productId', 'priceInRobux']
exports.optional = ['name', 'description', 'jar']

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
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.updateDeveloperProduct(1, 2, 10, "An Updated Developer Product", "My new updated product.")
**/

function updateDeveloperProduct (universeId, productId, priceInRobux, name, description, jar, token) {
  return new Promise((resolve, reject) => {
    return http({
      url: `//apis.roblox.com/developer-products/v1/universes/${universeId}/developerproducts/${productId}/update`,
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          Name: name,
          Description: description,
          PriceInRobux: priceInRobux
        },
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

exports.func = function ({ universeId, productId, priceInRobux, name, description, jar }) {
  return getGeneralToken({ jar })
    .then((token) => {
      return updateDeveloperProduct(universeId, productId, priceInRobux, name, description, jar, token)
    })
}

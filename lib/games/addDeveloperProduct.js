const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['universeId', 'name', 'priceInRobux']
exports.optional = ['description', 'jar']

// Docs
/**
 * 🔐 Create a developer product.
 * @category Game
 * @alias addDeveloperProduct
 * @param {number} universeId - The id of the universe.
 * @param {string} name - The name of the developer product.
 * @param {number} priceInRobux - The price of the product.
 * @param {string=} description - The description of the developer product.
 * @returns {Promise<DeveloperProductAddResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.addDeveloperProduct(1, "A Developer Product", 100, "A cool item.")
**/

const nextFunction = (jar, token, universeId, name, priceInRobux, description) => {
  description = description || ''
  return http({
    url: '//apis.roblox.com/developer-products/v1/universes/' + universeId + '/developerproducts?name=' + name + '&description=' + description + '&priceInRobux=' + priceInRobux,
    options: {
      method: 'POST',
      jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      resolveWithFullResponse: true
    }
  }).then(function (res) {
    if (res.statusCode !== 200) {
      throw new RobloxAPIError(res)
    }
    try {
      return JSON.parse(res.body)
    } catch (_) {
      throw new Error('Failed to parse response body (not valid JSON)')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.universeId, args.name, args.priceInRobux, args.description)
  })
}

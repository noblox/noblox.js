const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const checkProductName = require('./checkDeveloperProductName.js').func

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
  return checkProductName({
    universeId,
    productName: name
  }).then((res) => {
    if (res.Success && res.Message === 'Name available') {
      return http({
        url: `//apis.roblox.com/developer-products/v1/universes/${universeId}/developerproducts?name=${name}&description=${description}&priceInRobux=${priceInRobux}`,
        options: {
          method: 'POST',
          jar: jar,
          headers: {
            'X-CSRF-TOKEN': token
          },
          resolveWithFullResponse: true
        }
      }).then((res) => {
        if (res.status === 200) {
          return {
            universeId,
            name,
            priceInRobux,
            description,
            productId: typeof res.data === 'object' ? res.data.id : res.data.id
          }
        } else {
          throw new Error(`Create product failed, ${res.status} ${res.statusMessage}`)
        }
      })
    } else {
      throw new Error('Product with this name already exists')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.universeId, args.name, args.priceInRobux, args.description)
  })
}

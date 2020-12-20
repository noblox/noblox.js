const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const checkProductName = require('./checkDeveloperProductName.js').func
const parser = require('cheerio')

exports.required = ['universeId', 'productId', 'name', 'priceInRobux']
exports.optional = ['description', 'jar']

// Docs
/**
 * Update a developer product.
 * @category Game
 * @alias updateDeveloperProduct
 * @param {number} universeId - The id of the universe.
 * @param {number} productId - The id of the product.
 * @param {string} name - The new name of the product.
 * @param {number} priceInRobux - The new price of the product.
 * @param {string=} description - The new description of the product.
 * @returns {Promise<DeveloperProductUpdateResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.updateDeveloperProduct(1, 2, "An Updated Developer Product", 10, "My new updated product.")
**/

const nextFunction = (jar, token, universeId, productId, prodName, priceInRobux, prodDescription) => {
  return checkProductName({
    universeId: universeId,
    productId: productId,
    productName: prodName
  }).then((res) => {
    if (res.Success && res.Message === 'Name available') {
      return http({
        url: '//www.roblox.com/places/developerproducts/update',
        options: {
          method: 'POST',
          jar: jar,
          headers: {
            'X-CSRF-TOKEN': token
          },
          form: {
            universeId: universeId,
            name: prodName,
            developerProductId: productId,
            priceInRobux: priceInRobux,
            description: prodDescription
          },
          resolveWithFullResponse: true
        }
      }).then((res) => {
        if (res.statusCode === 200) {
          const $ = parser.load(res.body)
          const creationStatus = $('#DeveloperProductStatus')

          if (creationStatus.length > 0 && creationStatus.text().toLowerCase().indexOf('successfully updated') > -1) {
            return {
              universeId: universeId,
              name: prodName,
              priceInRobux: priceInRobux,
              description: prodDescription,
              productId: productId
            }
          }
        } else {
          throw new Error('Create product failed')
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
    return nextFunction(jar, xcsrf, args.universeId, args.productId, args.name, args.priceInRobux, args.prodDescription)
  })
}

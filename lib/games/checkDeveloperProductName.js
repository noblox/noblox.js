const http = require('../util/http.js').func

exports.required = ['universeId', 'productName']
exports.optional = ['jar', 'productId']

// Docs
/**
 * 🔐 Check if a provided name is in use by another developer product.
 * @category Game
 * @alias checkDeveloperProductName
 * @param {number} universeId - The id of the universe.
 * @param {string} productName - The name of the developer product.
 * @param {number=} productId - The id of the developer product.
 * @returns {Promise<CheckDeveloperProductNameResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const productInfo = await noblox.checkDeveloperProductName(1, "A Developer Product")
**/

exports.func = (args) => {
  const jar = args.jar
  const universeId = parseInt(args.universeId) ? parseInt(args.universeId) : 0
  const productId = parseInt(args.productId) ? parseInt(args.productId) : 0

  return http({
    url: '//www.roblox.com/places/check-developerproduct-name?universeId=' + universeId + '&developerProductId=' + productId + '&developerProductName=' + args.productName + '&_=1515792139751',
    options: {
      method: 'GET',
      jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error('You are not logged in')
    } else {
      return JSON.parse(res.body)
    }
  })
}

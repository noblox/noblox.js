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
 * @returns {Promise<Boolean>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const exists = await noblox.checkDeveloperProductName(1, "A Developer Product")
**/

exports.func = (args) => {
  const jar = args.jar
  const universeId = parseInt(args.universeId) ? parseInt(args.universeId) : 0
  const productId = parseInt(args.productId) ? parseInt(args.productId) : 0

  return http({
    url: `//apis.roblox.com/developer-products/v1/universes/${universeId}/developerproducts?pageNumber=1&pageSize=2147483647`,
    options: {
      method: 'GET',
      jar: jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error('You are not logged in')
    } else {
      const data = JSON.parse(res.body)
      let exists = false
      data.forEach(product => {
        if(product.name == args.productName || product.id == productId){
          exists = true
          return
        }
      })
      return exists
    }
  })
}

// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['productId', 'expectedPrice', 'expectedSellerId']
exports.optional = ['expectedCurrency', 'jar']

// Docs
/**
 * 🔐 Purchase a product.
 * @category Economy
 * @alias purchaseProduct
 * @param {number} productId - The ID of product to purchase.
 * @param {number} expectedPrice - Expected price of product.
 * @param {number} expectedSellerId - Expected Seller ID of product.
 * @param {number=} expectedCurrency - Expected currency for product.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.purchaseProduct(1234, 1, 100, 1234)
**/

// Define
function purchaseProduct (productId, expectedPrice, expectedSellerId, expectedCurrency, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    http({
      url: `//economy.roblox.com/v1/purchases/products/${productId}`,
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          expectedCurrency: expectedCurrency || 1,
          expectedPrice: expectedPrice,
          expectedSellerId: expectedSellerId
        })
      }
    }).then((res) => {
      if (res.statusCode === 200) {
        resolve()
      } else {
        const body = JSON.parse(res.body) || {}

        if (body.errors && body.errors.length > 0) {
          const errors = body.errors.map((e) => {
            return e.message
          })
          reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
        }
      }
    })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return purchaseProduct(args.productId, args.expectedPrice, args.expectedSellerId, args.expectedCurrency, jar, xcsrf)
    })
}

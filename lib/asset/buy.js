// Includes
const http = require('../util/http.js').func
const getProductInfo = require('./getProductInfo.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = [['asset', 'product']]
exports.optional = ['price', 'jar']

// Docs
/**
 * Buy an asset from the marketplace.
 * @category Assets
 * @param {number} productId - The id of the product.
 * @param {number=} price - The price of the product.
 * @returns {Promise<BuyAssetResponse>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.buy(1117747196)
**/

// Define
function buy (jar, token, product, price) {
  const robux = product.PriceInRobux || 0
  const productId = product.ProductId
  if (price) {
    if (typeof price === 'number') {
      if (robux !== price) {
        throw new Error('Price requirement not met. Requested price: ' + price + ' Actual price: ' + robux)
      }
    } else if (typeof price === 'object') {
      const high = price.high
      const low = price.low
      if (high) {
        if (robux > high) {
          throw new Error('Price requirement not met. Requested price: <=' + high + ' Actual price: ' + robux)
        }
      }
      if (low) {
        if (robux < low) {
          throw new Error('Price requirement not met. Requested price: >=' + low + ' Actual price: ' + robux)
        }
      }
    }
  }
  const httpOpt = {
    url: '//economy.roblox.com/v1/purchases/products/' + productId,
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        expectedCurrency: 1,
        expectedPrice: robux,
        expectedSellerId: product.Creator.Id
      }
    }
  }
  return http(httpOpt)
    .then(function (json) {
      let err = json.errorMsg
      if (json.reason === 'InsufficientFunds') {
        err = 'You need ' + json.shortfallPrice + ' more robux to purchase this item.'
      } else if (json.errorMsg) {
        err = json.errorMsg
      }
      if (!err) {
        return { productId, price: robux }
      } else {
        throw new Error(err)
      }
    })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({
    jar: jar
  })
    .then(function (token) {
      return buy(jar, token, args.product, args.price)
    })
}

exports.func = function (args) {
  if (!args.product) {
    return getProductInfo({
      asset: args.asset
    })
      .then(function (product) {
        args.product = product
        return runWithToken(args)
      })
  } else {
    return runWithToken(args)
  }
}

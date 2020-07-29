// Includes
const http = require('../util/http.js').func
const getProductInfo = require('./getProductInfo.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = [['asset', 'product']]
exports.optional = ['price', 'jar']

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
    url: '//www.roblox.com/API/Item.ashx?rqtype=purchase&productID=' + productId + '&expectedCurrency=1&expectedPrice=' + robux + '&expectedSellerID=' + product.Creator.Id + '&userAssetID=' + product.UserAssetId,
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      }
    }
  }
  return http(httpOpt)
    .then(function (body) {
      const json = JSON.parse(body)
      let err = json.errorMsg
      if (json.showDivID === 'InsufficientFundsView') {
        err = 'You need ' + Math.abs(json.balanceAfterSale) + ' more robux to purchase this item.'
      }
      if (!err) {
        return { productId: productId, price: robux }
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

// Includes
var http = require('./util/http.js').func;
var getProductInfo = require('./util/getProductInfo.js').func;
var getGeneralToken = require('./util/getGeneralToken.js').func;
var promise = require('./util/promise.js');

// Args
exports.required = [['asset', 'product']];
exports.optional = ['price', 'jar'];

// Define
function buy (jar, token, product, price) {
  return function (resolve, reject) {
    var robux = product.PriceInRobux || 0;
    var productId = product.ProductId;
    if (price) {
      if (typeof price === 'number') {
        if (robux !== price) {
          reject(new Error('Price requirement not met. Requested price: ' + price + ' Actual price: ' + robux));
          return;
        }
      } else if (typeof price === 'object') {
        var high = price.high;
        var low = price.low;
        if (high) {
          if (robux > high) {
            reject(new Error('Price requirement not met. Requested price: <=' + high + ' Actual price: ' + robux));
            return;
          }
        }
        if (low) {
          if (robux < low) {
            reject(new Error('Price requirement not met. Requested price: >=' + low + ' Actual price: ' + robux));
            return;
          }
        }
      }
    }
    var httpOpt = {
      url: '//www.roblox.com/API/Item.ashx?rqtype=purchase&productID=' + productId + '&expectedCurrency=1&expectedPrice=' + robux + '&expectedSellerID=' + product.Creator.Id,
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        }
      }
    };
    http(httpOpt)
    .then(function (body) {
      var json = JSON.parse(body);
      var err = json.errorMsg;
      if (json.showDivID === 'InsufficientFundsView') {
        err = 'You need ' + Math.abs(json.balanceAfterSale) + ' more robux to purchase this item.';
      }
      if (!err) {
        resolve({productId: productId, price: robux});
      } else {
        reject(new Error(err));
      }
    });
  };
}

function runWithToken (args) {
  var jar = args.jar;
  return getGeneralToken({
    jar: jar
  })
  .then(function (token) {
    return promise(buy(jar, token, args.product, args.price));
  });
}

exports.func = function (args) {
  if (!args.product) {
    return getProductInfo({
      asset: args.asset
    })
    .then(function (product) {
      args.product = product;
      return runWithToken(args);
    });
  } else {
    return runWithToken(args);
  }
};

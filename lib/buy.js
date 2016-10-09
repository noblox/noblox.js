// Includes
var http = require('./util/http.js').func;
var getProductInfo = require('./util/getProductInfo.js').func;
var getGeneralToken = require('./util/getGeneralToken.js').func;
var promise = require('./util/promise.js');

// Args
exports.args = ['asset', 'price', 'jar'];

// Define
function buy (jar, token, product, asset, price) {
  return function (resolve, reject) {
    var robux = product.PriceInRobux || 0;
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
      url: '//www.roblox.com/API/Item.ashx?rqtype=purchase&productID=' + product.ProductId + '&expectedCurrency=1&expectedPrice=' + robux + '&expectedSellerID=' + product.Creator.Id,
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
        resolve();
      } else {
        reject(new Error(err));
      }
    });
  };
}

exports.func = function (args) {
  var asset = args.asset;
  var jar = args.jar;
  return getProductInfo({asset: asset})
  .then(function (product) {
    return getGeneralToken({jar: jar})
  .then(function (token) {
    return promise(buy(jar, token, product, asset, args.price));
  }); });
};

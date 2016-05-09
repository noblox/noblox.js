// Dependencies
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.args = ['asset'];

// Define
function getProductInfo (asset) {
  return function (resolve, reject) {
    var httpOpt = {
      url: 'https://api.roblox.com/marketplace/productinfo?assetId=' + asset,
      options: {
        resolveWithFullResponse: true,
        method: 'GET'
      }
    };
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        resolve(JSON.parse(res.body));
      } else {
        reject(new Error('Asset does not exist'));
      }
    });
  };
}

exports.func = function (args) {
  var asset = args.asset;
  return cache.wrap('Product', asset, getProductInfo(asset));
};

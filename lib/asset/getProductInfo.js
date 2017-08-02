// Includes
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.required = ['asset'];

// Define
function getProductInfo (asset) {
  var httpOpt = {
    url: '//api.roblox.com/marketplace/productinfo?assetId=' + asset,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      return JSON.parse(res.body);
    } else {
      throw new Error('Asset does not exist');
    }
  });
}

exports.func = function (args) {
  var asset = args.asset;
  return cache.wrap('Product', asset, function () {
    return getProductInfo(asset);
  });
};

// Dependencies
var request = require('request');

// Define
module.exports = function(asset, callbacks) {
  request.get('http://api.roblox.com/marketplace/productinfo?assetId=' + asset, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getProductInfo');
      if (callbacks.always)
        callbacks.always();
    }
    if (res.statusCode == 200) {
      if (callbacks.success)
        callbacks.success(JSON.parse(body));
    } else if (callbacks.failure)
      callbacks.failure('Asset does not exist', 'getProductInfo2');
  });
};

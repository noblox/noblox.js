// Dependencies
var http = require('./util/http.js');

// Define
module.exports = function(jar, token, url, callbacks) {
  http(url, {method: 'POST', jar: jar, headers: {'X-CSRF-TOKEN': token}}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'buy1');
    }
    var json = JSON.parse(body);
    if (!json.errorMsg && callbacks.success)
      callbacks.success();
    else if (json.errorMsg && callbacks.failure)
      callbacks.failure(json.errorMsg, 'buy2');
  });
};

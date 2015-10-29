// Dependencies
var request = require('request');

// Define
module.exports = function(jar, url, token, callbacks) {
  request.post(url, {jar: jar, headers: {'X-CSRF-TOKEN': token}}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    if (res.statusCode == 200) {
      var json = JSON.parse(body);
      if (json.success && callbacks.success)
        callbacks.success();
      else if (!json.success) {
        if (callbacks.failure)
          callbacks.failure('Invalid promoting permissions');
        return console.error('Invalid promoting permissions');
      }
    }
  });
};

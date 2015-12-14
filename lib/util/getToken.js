// Dependencies
var http = require('./http.js');

// Define
module.exports = function(jar, url, callback, callbacks, form, json) {
  http(url, {method: 'POST', jar: jar, form: form, json: json}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getToken1');
      if (callbacks.always)
        callbacks.always();
    }
    if (res.headers['x-csrf-token'])
      callback(res.headers['x-csrf-token']);
    else if (callbacks.failure)
      callbacks.failure('Failed to retrieve X-CSRF-TOKEN', 'getToken2');
  });
};

// Dependencies
var request = require('request');

// Define
module.exports = function(jar, url, callback, callbacks, form, json) {
  request.post(url, {jar: jar, form: form, json: json}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'xcsrf1');
      if (callbacks.always)
        callbacks.always();
    }
    if (res.headers['x-csrf-token'])
      callback(res.headers['x-csrf-token']);
    else if (callbacks.failure)
      callbacks.failure('Failed to retrieve X-CSRF-TOKEN', 'xcsrf2');
  });
};

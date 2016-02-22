// This utility is for retrieving a general XCSRF token for APIs that do not return it on failure.
// It simply contacts a different API which does return the correct XCSRF token on failure and uses that one.

// Dependencies
var http = require('./http.js');

// Define
module.exports = function(jar, callback, callbacks) {
  http('http://www.roblox.com/messages/send', {method: 'POST', jar: jar}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getGeneralToken1');
      if (callbacks.always)
        callbacks.always();
    }
    if (res.headers['x-csrf-token'])
      callback(res.headers['x-csrf-token']);
    else if (callbacks.failure)
      callbacks.failure('Failed to retrieve X-CSRF-TOKEN', 'getGeneralToken2');
  });
};

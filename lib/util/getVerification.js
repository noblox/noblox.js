// Dependencies
var request = require('request');
var getVerificationInputs = require('./getVerificationInputs.js');

// Define
module.exports = function(jar, url, callback, callbacks) {
  request.get(url, {jar: jar}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getVerification1');
      if (callbacks.always)
        callbacks.always();
    }
    var inputs = getVerificationInputs(body);
    if (inputs)
      callback(inputs);
    else if (callbacks.failure)
      callbacks.failure('Failed to retrieve verification inputs', 'getVerification2');
  });
};

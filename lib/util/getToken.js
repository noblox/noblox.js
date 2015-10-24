// Dependencies
var request = require('request');

// Define
module.exports = function(jar,url,callback,callbacks,form,json) {
  request.post(url,{jar: jar, form: form, json: json},function(err,res,body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      if (callbacks.always)
        callbacks.always();
      return console.error('GetToken request failed: ' + err);
    }
    if (res.headers['x-csrf-token'])
      callback(res.headers['x-csrf-token']);
    else {
      if (callbacks.failure)
        callbacks.failure('Could not retrieve X-CSRF-TOKEN.');
      return console.error('Could not retrieve X-CSRF-TOKEN.');
    }
  });
};

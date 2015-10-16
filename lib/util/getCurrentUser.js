// Dependencies
var request = require('request');

// Define
module.exports = function(jar,option,callbacks) {
  request.get('http://www.roblox.com/mobileapi/userinfo', {followRedirect: false, jar: jar}, function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    if (res.statusCode == 200) {
      var json = JSON.parse(body);
      var result = (option ? json[option] : json);
      if (callbacks.success)
        callbacks.success(result);
      return result;
    } else {
      if (callbacks.failure)
        callbacks.failure('Not logged in');
    }
  });
};

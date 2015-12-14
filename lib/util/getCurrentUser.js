// Dependencies
var http = require('./http.js');

// Define
module.exports = function(jar, option, callbacks) {
  http('http://www.roblox.com/mobileapi/userinfo', {followRedirect: false, jar: jar}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure)
      callbacks.failure(err, 'getCurrentUser1');
    if (res.statusCode == 200) {
      var json = JSON.parse(body);
      var result = (option ? json[option] : json);
      if (callbacks.success)
        callbacks.success(result);
      return result;
    } else if (callbacks.failure)
      callbacks.failure('Not logged in', 'getCurrentUser2');
  });
};

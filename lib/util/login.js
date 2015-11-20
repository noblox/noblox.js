// Depdendencies
var request = require('request');

// Define
module.exports = function(jar, username, password, callbacks) {
  var url = 'https://www.roblox.com/MobileAPI/Login'; // Using this API because it returns user info. It's a miracle they have it!
  var post = {
    'username': username,
    'password': password,
  };
  request.post(url, {json: post, jar: jar}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure) {
      callbacks.failure(err, 'login1');
    }
    if (body.Status == 'OK') {
      var info = body.UserInfo;
      jar.user = {
        id: info.UserID,
        name: info.UserName
      };
      if (callbacks.success)
        callbacks.success();
    } else if (callbacks.failure)
      callbacks.failure(body.Status, 'login2');
  });
};

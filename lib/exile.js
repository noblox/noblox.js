// Dependencies
var request = require('request');
var getToken = require('./util/getToken.js');

// Define
module.exports = function(jar, token, json, callbacks) {
  request.post('http://www.roblox.com/My/Groups.aspx/ExileUserAndDeletePosts', {jar: jar, json: json, headers: {'X-CSRF-TOKEN': token}}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed:' + err);
    }
    if (res.statusCode == 200) {
      if (callbacks.success)
        callbacks.success();
    } else {
      var msg = 'Exile failed, response code ' + res.responseCode;
      if (callbacks.failure)
        callbacks.failure(msg);
      return console.error(msg);
    }
  });
};

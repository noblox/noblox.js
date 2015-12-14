// Dependencies
var http = require('./http.js');

// Define
module.exports = function(username, callbacks) {
  http('http://api.roblox.com/users/get-by-username?username=' + username, {method: 'GET'}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getIdFromUsername1');
      if (callbacks.always)
        callbacks.always();
    }
    var json = JSON.parse(body);
    if (json.Username)
      callbacks.success(json.Username);
    else if (json.errorMessage && callbacks.failure)
      callbacks.failure(json.errorMessage);
    else if (callbacks.failure)
      callbacks.failure('Get id from username failed', 'getIdFromUsername2');
  });
};

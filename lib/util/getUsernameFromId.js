// Dependencies
var request = require('request');

// Define
module.exports = function(id, callbacks) {
  request.get('http://api.roblox.com/users/' + id, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getUsernameFromId1');
      if (callbacks.always)
        callbacks.always();
    }
    if (res.statusCode == 200) {
      var json = JSON.parse(body);
      if (callbacks.success)
        callbacks.success(json.Username);
    } else if (callbacks.failure)
      callbacks.failure('User does not exist.','getUsernameFromId2');
  });
};

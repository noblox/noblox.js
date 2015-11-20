// Dependencies
var request = require('request');

// Define
module.exports = function(group, callbacks) {
  request.get('http://www.roblox.com/api/groups/' + group + '/RoleSets/', function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getRoles1');
      if (callbacks.always)
        callbacks.always();
    }
    if (callbacks.success)
      callbacks.success(JSON.parse(body));
  });
};

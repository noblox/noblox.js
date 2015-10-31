// Dependencies
var request = require('request');

// Define
module.exports = function(group, callbacks) {
  request.get('http://www.roblox.com/api/groups/' + group + '/RoleSets/', function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      if (callbacks.always)
        callbacks.always();
      return console.error('GetRoles request failed:' + err);
    }
    if (callbacks.success)
      callbacks.success(JSON.parse(body));
  });
};

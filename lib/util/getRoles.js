// Dependencies
var http = require('./http.js');

// Define
module.exports = function(group, callbacks) {
  http('http://www.roblox.com/api/groups/' + group + '/RoleSets/', function(err, res, body) {
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

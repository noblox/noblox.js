// Dependencies
var request = require('request');

// Define
module.exports = function(jar, group, callbacks) {
  request.get('http://www.roblox.com/My/Groups.aspx?gid=' + group, {jar: jar}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'getRolesetInGroupWithJar1');
      if (callbacks.always)
        callbacks.always();
    }
    if (res.statusCode == 200) {
      if (callbacks.success)
        callbacks.success(parseInt(body.match(/InitializeGlobalVars\((.*), /)[1], 10));
    } else if (callbacks.failure)
      callbacks.failure('Failed to get roleset in group using jar', 'getRolesetInGroupWithJar2');
  });
};

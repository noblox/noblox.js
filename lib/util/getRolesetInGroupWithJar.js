// Dependencies
var request = require('request');

// Define
module.exports = function(jar, group, callbacks) {
  request.get('http://www.roblox.com/My/Groups.aspx?gid=' + group, {jar: jar}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    var msg;
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      if (callbacks.always)
        callbacks.always();
      return console.error('GetRolesetInGroup request [1] failed:' + err);
    }
    if (res.statusCode == 200) {
      if (callbacks.success)
        callbacks.success(parseInt(body.match(/InitializeGlobalVars\((.*), /)[1], 10));
    } else {
      msg = 'GetRolesetInGroup [2] request failed';
      if (callbacks.failure)
        callbacks.failure(msg);
      return console.error(msg);
    }
  });
};

// Dependencies
var request = require('request');

// Define
module.exports = function(jar,group,callbacks) {
  request.get('http://www.roblox.com/My/Groups.aspx?gid=' + group,{jar: jar},function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error(err);
    }
    if (res.responseCode == 200) {
      if (callbacks.success)
        callbacks.success(parseInt(body.match(/InitializeGlobalVars\((.*), /)[1]));
    } else {
      var msg = 'Exile failed, response code ' + res.responseCode;
      if (callbacks.failure)
        callbacks.failure(msg);
      return console.error(msg);
    }
  });
};

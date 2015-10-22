// Dependencies
var request = require('request');

// Define
var api = 'http://www.roblox.com/My/Groups.aspx/ExileUserAndDeletePosts';

function exile(jar,token,group,target,senderRoleSetId,deleteAllPosts,callbacks) {
  request.post(api,{jar: jar, form: {
    userId: target,
    deleteAllPostsOption: deleteAllPosts || false,
    rolesetId: senderRoleSetId,
    selectedGroupId: group
  }, headers: {'X-CSRF-TOKEN': token}},function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error(err);
    }
    if (res.responseCode == 200) {
      if (callbacks.success)
        callbacks.success();
    } else {
      var msg = 'Exile failed, response code ' + res.responseCode;
      if (callbacks.failure)
        callbacks.failure(msg);
      return console.error(msg);
    }
  });
}

module.exports = function(jar,token) {
  if (token)
    exile.apply(undefined,arguments);
  else {
    getToken(jar,api,function(token) {
      var args = Array.prototype.slice.call(arguments);
      args[1] = token;
      exile.apply(undefined, args);
    },callbacks);
  }
};

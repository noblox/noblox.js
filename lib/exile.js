// Dependencies
var request = require('request');
var getToken = require('./util/getToken.js');

// Define
var api = 'http://www.roblox.com/My/Groups.aspx/ExileUserAndDeletePosts';

function exile(jar,token,json,callbacks) {
  request.post(api,{jar: jar, json: json, headers: {'X-CSRF-TOKEN': token}},function(err,res,body) {
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
}

module.exports = function(jar,token,group,target,senderRoleSetId,deleteAllPosts,callbacks) {
  var json = {
    userId: target,
    deleteAllPostsOption: deleteAllPosts || false,
    rolesetId: senderRoleSetId,
    selectedGroupId: group
  };
  if (token)
    exile(jar,token,json,callbacks);
  else {
    getToken(jar,api,function(token) {
      exile(jar,token,json,callbacks);
    },callbacks,undefined,json);
  }
};

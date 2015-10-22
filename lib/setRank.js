// Dependencies
var request = require('request');
var getToken = require('./util/getToken.js');

// Define
function setRank(jar,url,token,callbacks) {
  request.post(url,{jar: jar, headers: {'X-CSRF-TOKEN': token}},function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request failed: ' + err);
    }
    if (res.statusCode == 200) {
      var json = JSON.parse(body);
      if (json.success && callbacks.success)
        callbacks.success();
      else if (!json.success) {
        if (callbacks.failure)
          callbacks.failure('Invalid promoting permissions');
        return console.error('Invalid promoting permissions');
      }
    }
  });
}

module.exports = function(jar,group,target,role,token,callbacks) {
  var url = 'http://www.roblox.com/groups/api/change-member-rank?groupId=' + group + '&newRoleSetId=' + role + '&targetUserId=' + target;
  if (token)
    setRank(jar,url,token,callbacks);
  else {
    getToken(jar,url,function(token) {
      setRank(jar,url,token,callbacks);
    },callbacks);
  }
};

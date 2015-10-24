// Dependencies
var request = require('request');
var getInputs = require('./util/getInputs.js');
var getToken = require('./util/getToken.js');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);

// Define
var api = 'http://www.roblox.com/group/handle-join-request';

function getRequestId(jar,group,username,callback,callbacks) {
  var admin = 'http://www.roblox.com/My/GroupAdmin.aspx?gid=' + group;
  request.get(admin,{jar: jar},function(err,res,body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      if (callbacks.always)
        callbacks.always();
      return console.error('Request failed:' + err);
    }
    var post = getInputs(body,['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION']);
    post.ctl00$ctl00$cphRoblox$cphMyRobloxContent$JoinRequestsSearchBox = username;
    post.ctl00$ctl00$cphRoblox$cphMyRobloxContent$JoinRequestsSearchButton = 'Search';
    request.post(admin,{jar: jar, form: post},function(err,res,body) {
      if (err) {
        if (callbacks.failure)
          callbacks.failure(err);
        if (callbacks.always)
          callbacks.always();
        return console.error('Request [1] failed:' + err);
      }
      var id = $(body).find('[data-rbx-join-request]').attr('data-rbx-join-request');
      if (id)
        callback(id);
      else if (callbacks.failure) {
        var send = 'Couldn\'t get join request ID!';
        callbacks.failure(send);
        return console.error(send);
      }
    });
  });
}

function handleJoinRequest(jar,token,form,callbacks) {
  request.post(api,{jar: jar, form: form, headers: {'X-CSRF-TOKEN': token}},function(err,res,body) {
    if (callbacks.always)
      callbacks.always();
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      return console.error('Request [2] failed:' + err);
    }
    if (res.statusCode == 200) {
      if (JSON.parse(body).success) {
        if (callbacks.success)
          callbacks.success();
      } else {
        var send = 'Invalid join request permissions!';
        if (callbacks.failure)
          callbacks.failure(send);
        return console.error(send);
      }
    } else {
      if (callbacks.failure)
        callbacks.failure(body);
      return console.error('Request [3] failed:' + body);
    }
  });
}

module.exports = function(jar,token,group,username,accept,callbacks) {
  getRequestId(jar,group,username,function(id) {
    var form = {
      groupJoinRequestId: id,
      accept: accept
    };
    getToken(jar,api,function(token) {
      handleJoinRequest(jar,token,form,callbacks);
    },callbacks,form);
  },callbacks);
};

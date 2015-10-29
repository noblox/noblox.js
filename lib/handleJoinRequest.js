// Dependencies
var request = require('request');
var getVerificationInputs = require('./util/getVerificationInputs.js');
var $ = require('jquery')(require('jsdom').jsdom().parentWindow);

// Define
exports.request = function(jar, group, username, callback, callbacks) {
  var admin = 'http://www.roblox.com/My/GroupAdmin.aspx?gid=' + group;
  request.get(admin, {jar: jar}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err);
      if (callbacks.always)
        callbacks.always();
      return console.error('Request failed:' + err);
    }
    var post = getVerificationInputs(body);
    post.ctl00$ctl00$cphRoblox$cphMyRobloxContent$JoinRequestsSearchBox = username;
    post.ctl00$ctl00$cphRoblox$cphMyRobloxContent$JoinRequestsSearchButton = 'Search';
    request.post(admin, {jar: jar, form: post}, function(err, res, body) {
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
};

exports.handle = function(jar, token, form, callbacks) {
  request.post('http://www.roblox.com/group/handle-join-request', {jar: jar, form: form, headers: {'X-CSRF-TOKEN': token}}, function(err, res, body) {
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
};

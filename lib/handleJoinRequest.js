// Dependencies
var request = require('request');
var getVerificationInputs = require('./util/getVerificationInputs.js');
var cheerio = require('cheerio');

// Define
exports.request = function(jar, group, username, callback, callbacks) {
  var admin = 'http://www.roblox.com/My/GroupAdmin.aspx?gid=' + group;
  request.get(admin, {jar: jar}, function(err, res, body) {
    if (err) {
      if (callbacks.failure)
        callbacks.failure(err, 'handleJoinRequest1');
      if (callbacks.always)
        callbacks.always();
    }
    var post = getVerificationInputs(body);
    post.ctl00$ctl00$cphRoblox$cphMyRobloxContent$JoinRequestsSearchBox = username;
    post.ctl00$ctl00$cphRoblox$cphMyRobloxContent$JoinRequestsSearchButton = 'Search';
    request.post(admin, {jar: jar, form: post}, function(err, res, body) {
      if (err) {
        if (callbacks.failure)
          callbacks.failure(err, 'handleJoinRequest2');
        if (callbacks.always)
          callbacks.always();
      }
      var $ = cheerio.load(body);
      var id = $('[data-rbx-join-request]').attr('data-rbx-join-request');
      if (id)
        callback(id);
      else if (callbacks.failure)
        callbacks.failure('Couldn\'t get join request ID!', 'handleJoinRequest3');
    });
  });
};

exports.handle = function(jar, token, form, callbacks) {
  request.post('http://www.roblox.com/group/handle-join-request', {jar: jar, form: form, headers: {'X-CSRF-TOKEN': token}}, function(err, res, body) {
    if (callbacks.always)
      callbacks.always();
    if (err && callbacks.failure)
      callbacks.failure(err, 'handleJoinRequest4');
    if (res.statusCode == 200) {
      if (JSON.parse(body).success) {
        if (callbacks.success)
          callbacks.success();
      } else if (callbacks.failure)
          callbacks.failure('Invalid join request permissions', 'handleJoinRequest5');
    } else if (callbacks.failure)
        callbacks.failure(body, 'handleJoinRequest6');
  });
};

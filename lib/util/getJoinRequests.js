// Dependencies
var parser = require('whacko');

// Includes
var http = require('./http.js').func;

// Args
exports.required = ['group'];
exports.optoinal = ['jar'];

// Define
exports.func = function (args) {
  var httpOpt = {
    url: '//www.roblox.com/My/GroupAdmin.aspx?gid=' + args.group,
    options: {
      jar: args.jar,
      followRedirect: false,
      resolveWithFullResponse: true
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      var requests = [];
      var $ = parser.load(res.body);
      var found = $('#JoinRequestsList').find('tr');
      var len = found.length;
      if (len === 1) {
        return false;
      }
      for (var i = 1; i < len - 1; i++) {
        var data = found.eq(i).find('td');
        requests.push({
          username: data.eq(1).text(),
          date: new Date(data.eq(2).text() + ' CST'),
          requestId: data.eq(3).find('span').attr('data-rbx-join-request')
        });
      }
      return requests;
    } else {
      throw new Error('Group admin page load failed, make sure the user is logged in, in the group, and allowed to handle join requests');
    }
  });
};

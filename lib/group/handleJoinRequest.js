// Dependencies
var parser = require('cheerio');

// Includes
var http = require('../util/http.js').func;
var handleJoinRequestId = require('./handleJoinRequestId.js').func;
var options = require('../options.js');

// Args
exports.required = ['group', 'username', 'accept'];
exports.optional = ['jar'];

// Define
function getId (body, username) {
  var $ = parser.load(body);
  var found = $('#JoinRequestsList').find('tr');
  var len = found.length;
  if (len === 1) {
    return false;
  }
  for (var i = 1; i < len - 1; i++) {
    var data = found.eq(i).find('td');
    if (data.eq(1).text() === username) {
      return data.eq(3).find('span').attr('data-rbx-join-request');
    }
  }
}

function search (jar, group, username) {
  var httpOpt = {
    url: '//www.roblox.com/groups/' + group + '/joinrequests-html?username=' + username,
    options: {
      jar: jar,
      resolveWithFullResponse: true
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200 && res.body !== '') {
      var body = res.body;
      var id = getId(body, username);
      if (id) {
        return id;
      } else {
        throw new Error('No join request was found with that username');
      }
    } else {
      throw new Error('Could not load join requests, make sure you have permission to view them');
    }
  });
}

exports.func = function (args) {
  var jar = args.jar || options.jar;
  return search(jar, args.group, args.username)
  .then(function (requestId) {
    return handleJoinRequestId({jar: jar, requestId: requestId, accept: args.accept});
  });
};

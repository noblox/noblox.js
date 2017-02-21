// Dependencies
var parser = require('whacko');
var dns = require('dns');

// Includes
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');
var getSession = require('./util/getSession.js').func;
var handleJoinRequestId = require('./util/handleJoinRequestId.js').func;
var options = require('./options.js');

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

function getIp (resolve, reject) {
  dns.lookup('www.roblox.com', function (err, address) {
    if (err) {
      reject(new Error('DNS lookup error: ' + err));
      return;
    }
    resolve(address);
  });
}

function search (jar, ip, searchUrl, group, username) {
  console.log('Search');
  var httpOpt = {
    url: '//' + ip + searchUrl + '?groupId=' + group + '&username=' + username,
    options: {
      headers: {
        'Cookie': '.ROBLOSECURITY=' + getSession({jar: jar}) + ';'
      },
      resolveWithFullResponse: true,
      rejectUnauthorized: false
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      var body = res.body;
      var id = getId(body, username);
      if (id) {
        return id;
      } else {
        throw new Error('No join request was found with that username');
      }
    } else {
      throw new Error('Couldn\'t load search API');
    }
  });
}

function joinRequestId (jar, ip, group, username) {
  var httpOpt = {
    url: '//' + ip + '/My/GroupAdmin.aspx?gid=' + group,
    options: {
      headers: {
        'Cookie': '.ROBLOSECURITY=' + getSession({jar: jar}) + ';'
      },
      followRedirect: false,
      resolveWithFullResponse: true,
      rejectUnauthorized: false
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      var body = res.body;
      var id = getId(body, username);
      if (id) {
        return id;
      } else if (id === false) {
        throw new Error('No join request was found with that username');
      } else {
        return search(jar, ip, body.match(/Roblox\.GroupAdmin\.InitializeGlobalVars\(.*".*", "(.*)", .*\)/)[1], group, username);
      }
    } else {
      throw new Error('Group admin page load failed, make sure the user is logged in, in the group, and allowed to handle join requests');
    }
  });
}

exports.func = function (args) {
  // Because this has to access IPs directly and the IP is treated differently than the hostname to jar files the session is extracted manually.
  var jar = args.jar || options.jar;
  return promise(getIp)
  .then(function (ip) {
    return joinRequestId(jar, ip, args.group, args.username)
    .then(function (requestId) {
      return handleJoinRequestId({jar: jar, requestId: requestId, accept: args.accept});
    });
  });
};

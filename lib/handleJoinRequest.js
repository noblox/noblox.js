// Dependencies
var parser = require('cheerio');
var dns = require('dns');

// Includes
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');
var getGeneralToken = require('./util/getGeneralToken.js').func;
var getSession = require('./util/getSession.js').func;
var options = require('./options.js');

// Args
exports.required = ['group', 'username', 'accept'];
exports.optional = ['jar'];

// Define
function getId (body, username) {
  var $ = parser.load(body);
  var found = $('#JoinRequestsList').find('td');
  var len = found.length;
  if (len === 0) {
    return false;
  }
  for (var i = 0; i < len; i++) {
    var element = found.eq(i);
    if (element.text() === username) {
      return element.parent().find('[data-rbx-join-request]').attr('data-rbx-join-request');
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

function search (jar, ip, searchUrl, group, username, resolve, reject) {
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
  http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      var body = res.body;
      var id = getId(body, username);
      if (id) {
        resolve(id);
      } else {
        reject(new Error('No join request was found with that username'));
      }
    } else {
      reject(new Error('Couldn\'t load search API'));
    }
  });
}

function joinRequestId (jar, ip, group, username) {
  return function (resolve, reject) {
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
    http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var body = res.body;
        var id = getId(body, username);
        if (id) {
          resolve(id);
        } else if (id === false) {
          reject(new Error('No join request was found with that username'));
        } else {
          search(jar, ip, body.match(/Roblox\.GroupAdmin\.InitializeGlobalVars\(.*".*", "(.*)", .*\)/)[1], group, username, resolve, reject);
        }
      } else {
        reject(new Error('Group admin page load failed, make sure the user is logged in, in the group, and allowed to handle join requests'));
      }
    });
  };
}

function handleJoinRequest (jar, token, accept, requestId) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/group/handle-join-request',
      options: {
        method: 'POST',
        jar: jar,
        form: {
          groupJoinRequestId: requestId,
          accept: accept
        },
        headers: {
          'X-CSRF-TOKEN': token
        }
      }
    };
    http(httpOpt)
    .then(function (body) {
      if (JSON.parse(body).success) {
        resolve();
      } else {
        reject(new Error('Invalid permissions, make sure the user is in the group and is allowed to handle join requests'));
      }
    });
  };
}

exports.func = function (args) {
  // Because this has to access IPs directly and the IP is treated differently than the hostname to jar files the session is extracted manually.
  var jar = args.jar || options.jar;
  return promise(getIp)
  .then(function (ip) {
    return promise(joinRequestId(jar, ip, args.group, args.username))
    .then(function (requestId) {
      return getGeneralToken({jar: jar})
      .then(function (xcsrf) {
        return promise(handleJoinRequest(jar, xcsrf, args.accept, requestId));
      });
    });
  });
};

// Dependencies
var parser = require('cheerio');

// Includes
var http = require('./util/http.js').func;
var promise = require('./util/promise.js');
var getGeneralToken = require('./util/getGeneralToken.js').func;

// Args
exports.required = ['group', 'username', 'accept'];
exports.optional = ['jar'];

// Define
function getId (body, username) {
  var $ = parser.load(body);
  return $('#JoinRequestsList').find('td:contains(\'' + username + '\')').parent().find('[data-rbx-join-request]').attr('data-rbx-join-request'); // Yes this is technically vulnerable to injection, but the module will assume that whoever is entering information is correctly sanitizing it.
}

function search (jar, searchUrl, group, username, resolve, reject) {
  var httpOpt = {
    url: '//www.roblox.com' + searchUrl + '?groupId=' + group + '&username=' + username,
    options: {
      jar: jar,
      headers: {
        'Cache-Control': 'max-age=0'
      },
      followRedirect: false,
      resolveWithFullResponse: true
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

function joinRequestId (jar, group, username) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/my/groupadmin.aspx?gid=' + group,
      options: {
        jar: jar,
        headers: {
          'Cache-Control': 'max-age=0'
        },
        followRedirect: false,
        resolveWithFullResponse: true
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
          search(jar, body.match(/Roblox\.GroupAdmin\.InitializeGlobalVars\(.*".*", "(.*)", .*\)/)[1], group, username, resolve, reject);
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
  var jar = args.jar;
  return promise(joinRequestId(jar, args.group, args.username))
  .then(function (requestId) {
    return getGeneralToken({jar: jar})
    .then(function (xcsrf) {
      return promise(handleJoinRequest(jar, xcsrf, args.accept, requestId));
    });
  });
};

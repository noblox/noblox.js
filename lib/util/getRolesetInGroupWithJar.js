// Dependencies
var crypto = require('crypto');

// Includes
var http = require('./http.js').func;
var getSession = require('./getSession.js').func;
var options = require('../options.js');
var cache = require('../cache');

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
function getRolesetInGroupWithJar (jar, group) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/My/Groups.aspx?gid=' + group,
      options: {
        jar: jar
      }
    };
    http(httpOpt)
    .then(function (body) {
      resolve(parseInt(body.match(/InitializeGlobalVars\((.*), /)[1], 10));
    });
  };
}

exports.func = function (args) {
  var jar = args.jar || options.jar;
  var session = getSession({jar: jar});
  var hash = crypto.createHash('md5').update(session).digest('hex');
  return cache.wrap('RolesetId', hash, getRolesetInGroupWithJar(jar, args.group));
};

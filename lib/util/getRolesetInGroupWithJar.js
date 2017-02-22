// Includes
var http = require('./http.js').func;
var getHash = require('./getHash.js').func;
var cache = require('../cache');

// Args
exports.required = ['group'];
exports.optional = ['jar'];

// Define
function getRolesetInGroupWithJar (jar, group) {
  var httpOpt = {
    url: '//www.roblox.com/My/Groups.aspx?gid=' + group,
    options: {
      jar: jar
    }
  };
  return http(httpOpt)
  .then(function (body) {
    return parseInt(body.match(/InitializeGlobalVars\((.*), /)[1], 10);
  });
}

exports.func = function (args) {
  var jar = args.jar;
  var group = args.group;
  return cache.wrap('RolesetId', group + getHash({jar: jar}), function () {
    return getRolesetInGroupWithJar(jar, group);
  });
};

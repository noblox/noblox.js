// Includes
var http = require('./http.js').func;
var getHash = require('./getHash.js').func;
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
  var jar = args.jar;
  return cache.wrap('RolesetId', getHash({jar: jar}), getRolesetInGroupWithJar(jar, args.group));
};

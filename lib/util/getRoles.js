// Includes
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.args = ['group'];

// Define
function getRoles (group) {
  return function (resolve, reject) {
    var httpOpt = {
      url: '//www.roblox.com/api/groups/' + group + '/RoleSets/'
    };
    http(httpOpt)
    .then(function (body) {
      resolve(JSON.parse(body));
    });
  };
}

exports.func = function (args) {
  var group = args.group;
  return cache.wrap('Roles', group, getRoles(group));
};

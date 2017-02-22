// Includes
var http = require('./http.js').func;
var cache = require('../cache');

// Args
exports.required = ['group'];

// Define
function getRoles (group) {
  var httpOpt = {
    url: '//www.roblox.com/api/groups/' + group + '/RoleSets/'
  };
  return http(httpOpt)
  .then(function (body) {
    return JSON.parse(body);
  });
}

exports.func = function (args) {
  var group = args.group;
  return cache.wrap('Roles', group, function () {
    return getRoles(group);
  });
};

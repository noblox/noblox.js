// Includes
var http = require('../util/http.js').func
var cache = require('../cache')

// Args
exports.required = ['group']

// Define
function getRoles (group) {
  var httpOpt = {
    url: '//www.roblox.com/api/groups/' + group + '/RoleSets/'
  }
  return http(httpOpt)
    .then(function (body) {
      var roles = JSON.parse(body)
      for (var i = 0; i < roles.length; i++) {
        var role = roles[i]
        role.ID = role.Id
        delete role.Id
      }
      return roles
    })
}

exports.func = function (args) {
  var group = args.group
  return cache.wrap('Roles', group, function () {
    return getRoles(group)
  })
}

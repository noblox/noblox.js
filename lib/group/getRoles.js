// Includes
var http = require('../util/http.js').func
var cache = require('../cache')

// Args
exports.required = ['group']

// Define
function getRoles (group) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/roles`
    }
    return http(httpOpt)
      .then(function (body) {
        var roles = JSON.parse(body).roles
        roles = roles.sort((a, b) => a.rank - b.rank)
        for (var i = 0; i < roles.length; i++) {
          var role = roles[i]
          role.ID = role.id
          delete role.id
        }
        resolve(roles)
      })
  })
}

exports.func = function (args) {
  var group = args.group
  return cache.wrap('Roles', group, function () {
    return getRoles(group)
  })
}

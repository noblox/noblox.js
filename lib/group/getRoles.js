// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['group']

// Define
function getRoles (group) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/roles`
    }
    return http(httpOpt)
      .then(function (body) {
        let roles = JSON.parse(body).roles
        roles = roles.sort((a, b) => a.rank - b.rank)
        for (let i = 0; i < roles.length; i++) {
          const role = roles[i]
          role.ID = role.id
          delete role.id
        }
        resolve(roles)
      })
  })
}

exports.func = function (args) {
  const group = args.group
  return cache.wrap('Roles', group, function () {
    return getRoles(group)
  })
}

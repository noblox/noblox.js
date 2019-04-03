// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func
var getRole = require('./getRole.js').func

// Args
exports.required = ['group', 'target', ['rank', 'roleset', 'name']]
exports.optional = ['jar']

// Define
function setRank (jar, xcsrf, group, target, role) {
  var httpOpt = {
    url: `//groups.roblox.com/v1/groups/${group}/users/${target}`,
    options: {
      resolveWithFullResponse: true,
      method: 'PATCH',
      jar: jar,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': xcsrf
      },
      body: JSON.stringify({
        'roleId': role.ID
      })
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        return role
      } else {
        let body = JSON.parse(res.body) || {}
        let error = body.errors[0].message || 'Internal error, make sure the change rank request is valid.'
        throw new Error(`${res.statusCode} ${error}`)
        // throw new Error('Internal error, make sure the change rank request is valid.')
      }
    })
}

function runWithToken (args) {
  var jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return setRank(jar, xcsrf, args.group, args.target, args.role)
    })
}

exports.func = function (args) {
  if (!args.roleset) {
    var rank = args.rank
    var opt = {
      group: args.group
    }
    if (!rank) {
      opt.name = args.name
    } else {
      opt.rank = rank
    }
    return getRole(opt)
      .then(function (role) {
        if (!role) {
          throw new Error('Role does not exist')
        }
        args.role = role
        return runWithToken(args)
      })
  } else {
    args.role = { ID: args.roleset }
    return runWithToken(args)
  }
}

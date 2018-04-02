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
    url: '//www.roblox.com/groups/api/change-member-rank?groupId=' + group + '&newRoleSetId=' + role.ID + '&targetUserId=' + target,
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': xcsrf
      }
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var success = JSON.parse(res.body).success
        if (success) {
          return role
        } else {
          throw new Error('Invalid permissions, make sure the user is in the group and is allowed to change the rank of target')
        }
      } else {
        throw new Error('Internal error, make sure the change rank request is valid')
      }
    })
}

function runWithToken (args) {
  var jar = args.jar
  return getGeneralToken({jar: jar})
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
    args.role = {ID: args.roleset}
    return runWithToken(args)
  }
}

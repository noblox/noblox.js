// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const getRole = require('./getRole.js').func

// Args
exports.required = ['group', 'target', ['rank', 'roleset', 'name']]
exports.optional = ['jar']

// Define
function setRank (jar, xcsrf, group, target, role) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
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
          roleId: role.ID
        })
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(role)
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      })
  })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return setRank(jar, xcsrf, args.group, args.target, args.role)
    })
}

exports.func = function (args) {
  if (!args.roleset) {
    const rank = args.rank
    const opt = {
      group: args.group
    }
    if (!rank) {
      opt.name = args.name
    } else {
      if (typeof opt.rank !== 'number') {
        throw new Error('setRank: Rank number must be a number')
      }
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

// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const getRole = require('./getRole.js').func

// Args
exports.required = ['group', 'role', 'newRoleInfo']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Update a role's information
 * @category Group
 * @alias setRoleInfo
 * @param {number} group - The id of the group.
 * @param {number | string | Role} role - The rank, roleset ID, name of the role, or the actual Role itself.
 * @param {Role} newRoleInfo - The new info for the role
 * @returns {Promise<Role>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.setRoleInfo(1, 2342243, )
 **/

// Define
function setRoleInfo (jar, xcsrf, group, role, newRoleInfo) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/rolesets/${role.id}`,
      options: {
        resolveWithFullResponse: true,
        method: 'PATCH',
        jar,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': xcsrf
        },
        body: JSON.stringify({
          name: newRoleInfo.name,
          rank: newRoleInfo.rank,
          description: newRoleInfo.description
        })
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          role.name = newRoleInfo.name
          role.rank = newRoleInfo.rank
          role.description = newRoleInfo.description

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
      }).catch(error => reject(error))
  })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return setRoleInfo(jar, xcsrf, args.group, args.role, args.newRoleInfo)
    })
}

exports.func = function (args) {
  if (typeof args.role === 'object') { // assumes they gave Role
    return runWithToken(args)
  } else if (typeof args.role === 'number' || typeof args.role === 'string') {
    return getRole({ group: args.group, roleQuery: args.role }).then((role) => {
      args.role = role
      return runWithToken(args)
    })
  } else {
    throw new Error('Please provide either a Role, rank, or role name to change its info')
  }
}

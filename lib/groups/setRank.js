// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const getRole = require('./getRole.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group', 'target', 'rank']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Change a user's rank.
 * @category Group
 * @alias setRank
 * @param {number} group - The id of the group.
 * @param {number} target - The id of the user whose rank is being changed.
 * @param {number | string | Role} rank - The rank, roleset ID, name of the role, or the actual Role itself.
 * @returns {Promise<Role>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.setRank(1, 1, "Customer")
**/

// Define
function setRank (jar, xcsrf, group, target, role) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/users/${target}`,
      options: {
        resolveWithFullResponse: true,
        method: 'PATCH',
        jar,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': xcsrf
        },
        body: JSON.stringify({
          roleId: role.id
        })
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(role)
        } else {
          reject(new RobloxAPIError(res))
        }
      }).catch(error => reject(error))
  })
}

function runWithToken (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return setRank(jar, xcsrf, args.group, args.target, args.role)
    })
}

exports.func = function (args) {
  if (typeof args.rank === 'object') { // assumes they gave Role
    args.role = args.rank
    return runWithToken(args)
  } else if (typeof args.rank === 'number' || typeof args.rank === 'string') {
    return getRole({ group: args.group, roleQuery: args.rank }).then((role) => {
      args.role = role
      return runWithToken(args)
    })
  } else {
    throw new Error('Please provide either a Role, rank, or role name to change the user\'s rank to')
  }
}

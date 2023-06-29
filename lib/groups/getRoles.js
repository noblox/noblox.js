// Includes
const http = require('../util/http.js').func
const cache = require('../cache')

// Args
exports.required = ['group']

// Docs
/**
 * ✅ Get the roles in a group.
 * @category Group
 * @alias getRoles
 * @param {number} group - The id of the group.
 * @returns {Promise<Role[]>}
 * @example const noblox = require("noblox.js")
 * const roles = await noblox.getRoles(1)
**/

// Define
function getRoles (group) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/roles`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        const responseData = res.data
        if (res.status !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          let roles = responseData.roles
          roles = roles.sort((a, b) => a.rank - b.rank)
          for (let i = 0; i < roles.length; i++) {
            const role = roles[i]
            role.ID = role.id
          }
          resolve(roles)
        }
      }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  const group = args.group
  return cache.wrap('Roles', group, function () {
    return getRoles(group)
  })
}

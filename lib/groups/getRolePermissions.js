// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['group', 'rolesetId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get the permissions for a role.
 * @category Group
 * @alias getRolePermissions
 * @param {number} group - The id of the group.
 * @param {number} rolesetId - The rolesetId of the role.
 * @returns {Promise<RolePermissions>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const rolePermissions = await noblox.getRolePermissions(1, 1117747196)
**/

function getRolePermissions (group, rolesetId, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/roles/${rolesetId}/permissions`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          reject(new RobloxAPIError(res))
        } else {
          resolve(responseData)
        }
      }).catch(error => reject(error))
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getRolePermissions(args.group, args.rolesetId, jar)
}

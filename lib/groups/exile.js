// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group', 'target']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Exile a user from a group.
 * @category Group
 * @alias exile
 * @param {number} group - The id of the group.
 * @param {number} target - The userId of the user being exiled.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.exile(1, 2)
**/

function exileUser (group, target, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/users/${target}`,
      options: {
        method: 'DELETE',
        resolveWithFullResponse: true,
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode !== 200) {
          reject(new RobloxAPIError(res))
        } else {
          resolve()
        }
      }).catch(error => reject(error))
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return exileUser(args.group, args.target, args.jar, xcsrf)
    })
}

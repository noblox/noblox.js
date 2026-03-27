// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'target']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Unban a user from a group.
 * @category Group
 * @alias unban
 * @param {number} group - The id of the group.
 * @param {number} target - The userId of the user being Unbanned.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.unban(1, 2)
**/

function unbanUser (group, target, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/bans/${target}`,
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
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
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
      return unbanUser(args.group, args.target, args.jar, xcsrf)
    })
}

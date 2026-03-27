// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'target']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Ban a user from a group.
 * @category Group
 * @alias ban
 * @param {number} group - The id of the group.
 * @param {number} target - The userId of the user being Banned.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.ban(1, 2)
**/

function banUser (group, target, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/bans/${target}`,
      options: {
        method: 'POST',
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
      return banUser(args.group, args.target, args.jar, xcsrf)
    })
}

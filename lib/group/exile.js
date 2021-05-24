// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'userId']
exports.optional = ['jar']

// Docs
/**
 * Exile a user from a group.
 * @category Group
 * @alias exile
 * @param {number} group - The id of the group.
 * @param {number} userId - The userId of the user being exiled.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.exile(1, 2)
**/

function exileUser (group, userId, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/users/${userId}`,
      options: {
        method: 'DELETE',
        resolveWithFullResponse: true,
        jar: jar,
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
      })
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return exileUser(args.group, args.userId, args.jar, xcsrf)
    })
}

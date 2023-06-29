// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Removes all wall posts sent by the provided user.
 * @category Group
 * @alias deleteWallPostsByUser
 * @param {number} group - The id of the group.
 * @param {number} userId - The userId of the user having their posts removed.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.deleteWallPostsByUser(1, 2)
 **/

function deleteWallPostsByUser (group, userId, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/wall/users/${userId}/posts`,
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
        const responseData = res.data
        if (res.status !== 200) {
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
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return deleteWallPostsByUser(args.group, args.userId, args.jar, xcsrf)
    })
}

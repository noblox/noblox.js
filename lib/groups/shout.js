// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group']
exports.optional = ['message', 'jar']

// Docs
/**
 * 🔐 Change a group's shout.
 * @category Group
 * @alias shout
 * @param {number} group - The id of the group.
 * @param {string=} [message=""] - The message to shout
 * @returns {Promise<GroupShout>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.shout(1, "Hello world!")
**/

function shoutOnGroup (group, message = '', jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/status`,
      options: {
        method: 'PATCH',
        resolveWithFullResponse: true,
        json: {
          message
        },
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body)
        } else {
          reject(new RobloxAPIError(res))
        }
      }).catch(error => reject(error))
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return shoutOnGroup(args.group, args.message, args.jar, xcsrf)
    })
}

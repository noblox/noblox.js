// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['groupId']
exports.optional = []

// Docs
/**
 * ✅ Get a group's info.
 * @category Group
 * @alias getGroup
 * @param {number} groupId - The id of the group.
 * @returns {Promise<Group>}
 * @example const noblox = require("noblox.js")
 * const groupInfo = await noblox.getGroup(1)
**/

// Define
function getGroup (groupId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//groups.roblox.com/v1/groups/${groupId}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          const body = JSON.parse(res.body)

          if (body.shout) {
            body.shout.created = new Date(body.shout.created)
            body.shout.updated = new Date(body.shout.updated)
          }

          resolve(body)
        } else {
          reject(new RobloxAPIError(res))
        }
      }).catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getGroup(args.groupId)
}

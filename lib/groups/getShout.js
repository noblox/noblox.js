// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['group']
exports.optional = []

// Docs
/**
 * 🔓 Get the group's shout.
 * @category Group
 * @alias getShout
 * @param {number} group - The id of the group.
 * @returns {Promise<GroupShout>}
 * @example const noblox = require("noblox.js")
 * const groupShout = await noblox.getShout(1)
**/

// Define
function getShout (group, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = res.data
        if (res.status === 400) {
          reject(new Error('The group is invalid or does not exist.'))
        }
        if (responseData.shout === null) {
          reject(new Error('You do not have permissions to view the shout for the group.'))
        } else {
          resolve(responseData.shout)
        }
      })
      .catch(error => reject(error))
  })
}

exports.func = function (args) {
  return getShout(args.group, args.jar)
}

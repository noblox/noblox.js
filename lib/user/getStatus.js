// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']

// Docs
/**
 * Get a user's status.
 * @category User
 * @deprecated Obsolete function, will be deleted in future version. Use getPlayerInfo instead.
 * @alias getStatus
 * @param {number} userId - The id of the user.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * let status = await noblox.getStatus({userId: 123456})
**/

// Define
exports.func = function (args) {
  return http({
    url: '//www.roblox.com/users/profile/profileheader-json?userid=' + args.userId,
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  })
    .then(function (res) {
      if (res.statusCode === 200) {
        return JSON.parse(res.body).UserStatus
      } else {
        throw new Error('User does not exist')
      }
    })
}

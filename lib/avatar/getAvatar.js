const http = require('../util/http.js').func

exports.required = ['userId']

// Docs
/**
 * ✅ Get a user's avatar.
 * @category Avatar
 * @alias getAvatar
 * @param {number} userId - The user's userId.
 * @returns {Promise<AvatarInfo>}
 * @example const noblox = require("noblox.js")
 * const avatar = await noblox.getAvatar(1)
**/

const getAvatar = (userId) => {
  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/avatar',
    options: {
      method: 'GET',
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
    } else {
      throw new Error('User does not exist')
    }
  })
}

exports.func = (args) => {
  const userId = args.userId
  return getAvatar(userId)
}

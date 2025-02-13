const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['avatarType']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Set the type of your avatar.
 * @category Avatar
 * @alias setPlayerAvatarType
 * @param {PlayerAvatarType} avatarType - The type of your avatar. (R6 or R15)
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.setPlayerAvatarType("R6")
**/

const nextFunction = (jar, token, avatarType) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/set-player-avatar-type',
    options: {
      method: 'POST',
      jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        playerAvatarType: avatarType
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.success) {
        throw new RobloxAPIError(res)
      }
    } else {
      throw new RobloxAPIError(res)
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.avatarType)
  })
}

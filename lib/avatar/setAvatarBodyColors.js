const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['headColorId', 'torsoColorId', 'rightArmColorId', 'leftArmColorId', 'rightLegColorId', 'leftLegColorId']
exports.optional = ['jar']

// Docs
/**
 * Set the colors of your avatar.
 * @category Avatar
 * @alias setAvatarBodyColours
 * @param {number} headColorId - The [BrickColor Code]{@link https://developer.roblox.com/en-us/articles/BrickColor-Codes} of the head.
 * @param {number} torsoColorId - The [BrickColor Code]{@link https://developer.roblox.com/en-us/articles/BrickColor-Codes} of the torso.
 * @param {number} rightArmColorId - The [BrickColor Code]{@link https://developer.roblox.com/en-us/articles/BrickColor-Codes} of the right arm.
 * @param {number} leftArmColorId - The [BrickColor Code]{@link https://developer.roblox.com/en-us/articles/BrickColor-Codes} of the left arm.
 * @param {number} rightLegColorId - The [BrickColor Code]{@link https://developer.roblox.com/en-us/articles/BrickColor-Codes} of the right leg.
 * @param {number} leftLegColorId - The [BrickColor Code]{@link https://developer.roblox.com/en-us/articles/BrickColor-Codes} of the left leg.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.setAvatarBodyColours(125, 125, 125, 125, 125, 125)
**/

const nextFunction = (jar, token, headColorId, torsoColorId, rightArmColorId, leftArmColorId, rightLegColorId, leftLegColorId) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/set-body-colors',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        headColorId: headColorId,
        torsoColorId: torsoColorId,
        rightArmColorId: rightArmColorId,
        leftArmColorId: leftArmColorId,
        rightLegColorId: rightLegColorId,
        leftLegColorId: leftLegColorId
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.success) {
        throw new Error(res.body)
      }
    } else {
      throw new Error('Set body colours failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.headColorId, args.torsoColorId, args.rightArmColorId, args.leftArmColorId, args.rightLegColorId, args.leftLegColorId)
  })
}
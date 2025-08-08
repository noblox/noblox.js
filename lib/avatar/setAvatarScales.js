const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['height', 'width', 'head']
exports.optional = ['depth', 'proportion', 'bodyType', 'jar']

// Docs
/**
 * 🔐 Set the scale of your avatar.
 * @category Avatar
 * @alias setAvatarScales
 * @param {number} height - The height scale of the avatar.
 * @param {number} width - The width scale of the avatar.
 * @param {number} head - The head scale of the avatar.
 * @param {number=} depth - The depth scale of the avatar.
 * @param {number=} proportion - The proportion scale of the avatar.
 * @param {number=} bodyType - The body type scale of the avatar.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.setAvatarScales(1, 1, 1, 1, 1, 1)
**/

const nextFunction = (jar, token, height, width, head, depth, proportion, bodyType) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/set-scales',
    options: {
      method: 'POST',
      jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        height,
        width,
        head,
        depth,
        proportion,
        bodyType
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
    return nextFunction(jar, xcsrf, args.height, args.width, args.head, args.depth, args.proportion, args.bodyType)
  })
}

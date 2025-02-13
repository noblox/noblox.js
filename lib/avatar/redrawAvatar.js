const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.optional = ['jar']

// Docs
/**
 * 🔐 Redraw your avatar.
 * @category Avatar
 * @alias redrawAvatar
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.redrawAvatar()
**/

function redrawAvatar (jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//avatar.roblox.com/v1/avatar/redraw-thumbnail',
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt).then((res) => {
      if (res.statusCode === 200) {
        resolve()
      } else {
        reject(new RobloxAPIError(res))
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return redrawAvatar(jar, xcsrf)
  })
}

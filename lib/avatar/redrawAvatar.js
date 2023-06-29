const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

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
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt).then((res) => {
      if (res.status === 200) {
        resolve()
      } else if (res.status === 429) {
        reject(new Error('Redraw avatar floodchecked'))
      } else {
        reject(new Error('Redraw avatar failed'))
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return redrawAvatar(jar, xcsrf)
  })
}

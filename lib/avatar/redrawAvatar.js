const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.optional = ['jar']

// Docs
/**
 * Redraw your avatar.
 * @category Avatar
 * @alias redrawAvatar
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.redrawAvatar()
**/

const nextFunction = (jar, token) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/redraw-thumbnail',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.success) {
        throw new Error(res.body)
      }
    } else if (res.statusCode === 429) {
      throw new Error('Redraw avatar floodchecked')
    } else {
      throw new Error('Redraw avatar failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf)
  })
}

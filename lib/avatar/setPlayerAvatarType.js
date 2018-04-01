let http = require('../util/http.js').func,
  getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['avatarType']
exports.optional = ['jar']

let nextFunction = (jar, token, avatarType) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/set-player-avatar-type',
    options: {
      method: 'POST',
      jar: jar,
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
        throw new Error(res.body)
      }
    } else {
      throw new Error('Set avatar type failed')
    }
  })
}

exports.func = (args) => {
  let jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.avatarType)
  })
}

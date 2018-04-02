<<<<<<< HEAD
let http = require('../util/http.js').func,
    getGeneralToken = require('../util/getGeneralToken.js').func
=======
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['avatarType']
exports.optional = ['jar']

<<<<<<< HEAD
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
=======
const nextFunction = (jar, token, avatarType) => {
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
  const jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.avatarType)
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

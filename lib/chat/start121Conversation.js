let http = require('../util/http.js').func,
  getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['userId']
exports.optional = ['jar']

let nextFunction = (jar, token, userId) => {
  return http({
    url: '//chat.roblox.com/v2/start-one-to-one-conversation',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        participantUserId: userId
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Start conversation failed')
    }
  })
}

exports.func = (args) => {
  let jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.userId)
  })
}

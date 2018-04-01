let http = require('../util/http.js').func,
  getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['placeId']
exports.optional = ['jar']

let nextFunction = (jar, token, placeId) => {
  return http({
    url: '//chat.roblox.com/v2/start-cloud-edit-conversation',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        placeId: placeId
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Start cloud edit chat failed')
    }
  })
}

exports.func = (args) => {
  let jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.placeId)
  })
}

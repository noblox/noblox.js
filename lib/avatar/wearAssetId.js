const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['assetId']
exports.optional = ['jar']

const nextFunction = (jar, token, assetId) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/assets/' + assetId + '/wear',
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
    } else {
      throw new Error('Wear assetId failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.assetId)
  })
}

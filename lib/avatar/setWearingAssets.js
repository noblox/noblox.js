let http = require('../util/http.js').func,
  getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['assetIds']
exports.optional = ['jar']

let nextFunction = (jar, token, assetIds) => {
  return http({
    url: '//avatar.roblox.com/v1/avatar/set-wearing-assets',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        assetIds: assetIds
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.success) {
        throw new Error('Invalid assets: ' + res.body.invalidAssetIds.join(', '))
      }
    } else {
      throw new Error('Wear assets failed')
    }
  })
}

exports.func = (args) => {
  let jar = args.jar

  return getGeneralToken({jar: jar}).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.assetIds)
  })
}

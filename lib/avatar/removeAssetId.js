const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['assetId']
exports.optional = ['jar']

function removeAssetId (assetId, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: 'https://avatar.roblox.com/v1/avatar/assets/' + assetId + '/remove',
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        },
        resolveWithFullResponse: true
      }
    }

    return http(httpOpt)
      .then(function (res) {
        let responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve()
        }
      })
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return removeAssetId(args.assetId, jar, xcsrf)
  })
}

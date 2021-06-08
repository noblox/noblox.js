const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['assetId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Wear a specific asset.
 * @category Avatar
 * @alias wearAssetId
 * @param {number} assetId - The assetId to wear.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.wearAssetId(1117747196)
**/

function wearAssetId (assetId, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: 'https://avatar.roblox.com/v1/avatar/assets/' + assetId + '/wear',
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
        const responseData = JSON.parse(res.body)
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
    return wearAssetId(args.assetId, jar, xcsrf)
  })
}

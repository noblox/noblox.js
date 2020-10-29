const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['universeId', 'name', 'priceInRobux']
exports.optional = ['prodDescription', 'iconImageAssetId', 'jar']

const nextFunction = (jar, xcsrf, universeId, prodName, priceInRobux, prodDescription, iconImageAssetId) => {
  return http({
    url: `//develop.roblox.com/v1/universes/${universeId}/developerproducts?name=${prodName}&priceInRobux=${priceInRobux}&description=${prodDescription}&iconImageAssetId=${iconImageAssetId}`,
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': xcsrf
      }
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
    } else {
      const body = JSON.parse(res.body) || {}
      if (body.errors && body.errors.length > 0) {
        const errors = body.errors.map((e) => {
          return e.message
        })
        throw new Error(`${res.statusCode} ${errors.join(', ')}`)
      }
    }
  })
}

exports.func = (args) => {
  const jar = args.jar
  const prodDescription = args.prodDescription || ""
  const iconImageAssetId = args.iconImageAssetId || ""

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.universeId, args.name, args.priceInRobux, prodDescription, iconImageAssetId)
  })
}

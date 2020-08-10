const http = require('../util/http.js').func
const rbxDate = require('../util/getDate.js').func

exports.required = ['placeId']

function getPlaceInfo (placeId) {
  const httpOpt = {
    url: `//www.roblox.com/places/api-get-details?assetId=${placeId}`,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        const body = JSON.parse(res.body)
        const created = rbxDate({ time: body.Created, timezone: 'CT' })
        const updated = rbxDate({ time: body.Updated, timezone: 'CT' })

        delete body.Created
        delete body.Updated
        return {
          ...body,
          Created: created,
          Updated: updated
        }
      } else {
        throw new Error('Game does not exist')
      }
    })
}

exports.func = function (args) {
  return getPlaceInfo(args.placeId)
}

// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['assetType', 'sortOrder', 'limit']

// Define
function getCollectibles (userId, assetType, sortOrder, limit, pageCursor, currentCollectibles) {
  return new Promise((resolve, reject) => {
    const allowedLimits = [10, 25, 50, 100]

    const httpOpt = {
      url: `//inventory.roblox.com/v1/users/${userId}/assets/collectibles`,
      options: {
        qs: {
          assetType: assetType,
          sortOrder: sortOrder || 'Asc',
          limit: limit <= 100 ? allowedLimits.reduce((prev, curr) => Math.abs(curr - limit) < Math.abs(prev - limit) ? curr : prev) : 100,
          cursor: pageCursor || ''
        },
        method: 'GET',
        resolveWithFullResponse: true,
        json: true
      }
    }
    return http(httpOpt).then((res) => {
      const body = res.body

      if (body.errors && body.errors.length > 0) {
        const errors = body.errors.map((e) => {
          return e.message
        })

        throw new Error(`${res.statusCode} ${errors.join(', ')}`)
      }

      currentCollectibles = currentCollectibles ? currentCollectibles.concat(body.data) : body.data

      if (currentCollectibles.length > limit) {
        currentCollectibles = currentCollectibles.slice(0, limit)
      }

      if (currentCollectibles.length >= limit || body.data.length === 0 || !body.nextPageCursor) {
        return resolve(currentCollectibles)
      }

      resolve(getCollectibles(userId, assetType, sortOrder, limit, body.nextPageCursor, currentCollectibles))
    })
  })
}

exports.func = function (args) {
  return getCollectibles(args.userId, args.assetType, args.sortOrder, args.limit)
}

// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId', 'assetTypes']
exports.optional = ['sortOrder', 'limit']

// Define
function getInventory (userId, assetTypes, sortOrder, limit, pageCursor, currentInventory) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(assetTypes)) throw new Error('assetTypes must be an array.')
    const allowedLimits = [10, 25, 50, 100]

    const httpOpt = {
      url: `//inventory.roblox.com/v2/users/${userId}/inventory`,
      options: {
        qs: {
          assetTypes: assetTypes.join(','),
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

      currentInventory = currentInventory ? currentInventory.concat(body.data) : body.data

      if (currentInventory.length > limit) {
        currentInventory = currentInventory.slice(0, limit)
      }

      if (currentInventory.length >= limit || body.data.length === 0 || !body.nextPageCursor) {
        return resolve(currentInventory)
      }

      resolve(getInventory(userId, assetTypes, sortOrder, limit, body.nextPageCursor, currentInventory))
    })
  })
}

exports.func = function (args) {
  return getInventory(args.userId, args.assetTypes, args.sortOrder, args.limit)
}

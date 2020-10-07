// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId', 'assetTypeId']
exports.optional = ['sortOrder', 'limit']

// Define
function getInventoryById (userId, assetTypeId, sortOrder, limit, pageCursor, currentInventory) {
  return new Promise((resolve, reject) => {
    if (typeof (assetTypeId) !== 'number') throw new Error('assetTypeId must be a number.')
    const allowedLimits = [10, 25, 50, 100]

    const httpOpt = {
      url: `//inventory.roblox.com/v2/users/${userId}/inventory/${assetTypeId}`,
      options: {
        qs: {
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

      resolve(getInventoryById(userId, assetTypeId, sortOrder, limit, body.nextPageCursor, currentInventory))
    })
  })
}

exports.func = function (args) {
  return getInventoryById(args.userId, args.assetTypeId, args.sortOrder, args.limit)
}

// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId', 'itemTargetId']
exports.optional = ['itemType']

// Docs
/**
 * ✅ Check if the user owns the asset.
 * @category User
 * @alias getOwnership
 * @param {number} userId - The id of the user whose ownership is being checked.
 * @param {number} itemTargetId - The id of the item.
 * @param {("Asset" | "GamePass" | "Badge" | "Bundle")=} [itemType=Asset] - The type of item in question (Asset, GamePass, Badge, Bundle)
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * let ownership = await noblox.getOwnership(123456, 234567, "GamePass")
**/

// Define
function getOwnership (userId, itemTargetId, itemType) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//inventory.roblox.com/v1/users/${userId}/items/${itemType}/${itemTargetId}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.status === 200) {
          const body = res.data
          resolve(body.data.length > 0)
        } else {
          const body = res.data || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.status} ${errors.join(', ')}`))
          } else {
            reject(new Error(`${res.status} ${res.data}`))
          }
        }
      })
  })
}

exports.func = function (args) {
  const itemType = args.itemType || 'Asset'
  return getOwnership(args.userId, args.itemTargetId, itemType)
}

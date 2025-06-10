// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

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
        if (res.statusCode === 200) {
          const body = JSON.parse(res.body)
          resolve(body.data.length > 0)
        } else {
          reject(new RobloxAPIError(res))
        }
      })
  })
}

exports.func = function (args) {
  const itemType = args.itemType || 'Asset'
  return getOwnership(args.userId, args.itemTargetId, itemType)
}

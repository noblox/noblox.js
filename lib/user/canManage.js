// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId', 'assetId']

// Docs
/**
 * ✅ Returns whether the user can manage a given asset.
 * @category User
 * @alias canManage
 * @param {number} userId - The id of the user.
 * @param {number} assetId - The id of the asset.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * let canManage = await noblox.canManage(123456, 234567)
**/

// Define
function canManage (userId, assetId) {
  return new Promise((resolve, reject) => {
    http({
      url: `//develop.roblox.com/v1/user/${userId}/canmanage/${assetId}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    })
      .then(function ({ statusCode, body }) {
        const { Success: success, CanManage: canManage, ErrorMessage: error } = JSON.parse(body)
        if (success) {
          resolve(canManage)
        } else {
          if (error) {
            reject(`${error} | userId: ${userId}, assetId: ${assetId}`)
          } else {
            reject(`An unknown error occurred with canManage() | [${statusCode}] userId: ${userId}, assetId: ${assetId}`)
          }
        }
      })
  })
}

exports.func = function ({ userId, assetId }) {
  return canManage(userId, assetId)
}

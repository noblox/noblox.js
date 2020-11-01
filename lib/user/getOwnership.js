// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId', 'assetId']
exports.optional = []

// Docs
/**
 * Check if the user owns the asset.
 * @category User
 * @alias getOwnership
 * @param {number} userId - The id of the user whose ownership is being checked.
 * @param {number} assetId - The id of the asset.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * let ownership = await noblox.getOwnership(123456, 234567)
**/

// Define
function getOwnership (userId, assetId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//api.roblox.com/ownership/hasasset?userId=${userId}&assetId=${assetId}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(res.body === 'true')
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          } else {
            reject(new Error(`${res.statusCode} ${res.body}`))
          }
        }
      })
  })
}

exports.func = function (args) {
  return getOwnership(args.userId, args.assetId)
}

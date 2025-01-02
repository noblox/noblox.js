// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['assetId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Removes an asset from the authenticated user's inventory; throws an error if the item is not owned.
 * @category Asset
 * @alias deleteFromInventory
 * @param {number} assetId - The id of the asset.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * await noblox.deleteFromInventory(144075659)
**/

// Define
function deleteFromInventory (jar, assetId, xcsrf) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://inventory.roblox.com/v2/inventory/asset/${assetId}`,
      options: {
        method: 'DELETE',
        resolveWithFullResponse: true,
        jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve()
        } else {
          reject(new RobloxAPIError(res))
        }
      })
      .catch(error => reject(error))
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return deleteFromInventory(jar, args.assetId, xcsrf)
    })
}

// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

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
      url: 'https://www.roblox.com/asset/delete-from-inventory',
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        body: `assetId=${assetId}`,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf,
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = typeof res.body === 'string' ? JSON.parse(res.body) : res.body
        // Roblox likes to error here with 200 status codes too with inconsistency
        if (res.statusCode === 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && !responseData.isValid) {
            error = responseData.error
            reject(new Error(error))
          } else if (responseData && responseData.isValid) {
            resolve()
          }
        } else {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        }
      })
      .catch(error => reject(error))
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return deleteFromInventory(jar, args.assetId, xcsrf)
    })
}

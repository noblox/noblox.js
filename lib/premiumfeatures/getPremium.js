// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Gets whether or not a user has premium.
 * @category User
 * @alias getPremium
 * @param {number} userId - The id of the user.
 * @returns {Promise<boolean>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const hasPremium = await noblox.getPremium(123456)
 **/

// Define
function getPremium (jar, userId) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://premiumfeatures.roproxy.com/v1/users/${userId}/validate-membership`,
      options: {
        method: 'GET',
        jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          // Assuming 'true' or 'false' is returned as plain text
          resolve(res.body.trim() === 'true')
        } else {
          try {
            const body = JSON.parse(res.body)
            if (body.errors && body.errors.length > 0) {
              const errors = body.errors.map((e) => e.message)
              reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
            } else {
              reject(new Error(`Unexpected server response: ${res.body}`))
            }
          } catch (e) {
            // Handle JSON parsing error
            reject(new Error(`Error parsing JSON from server: ${e.message}. Server response: ${res.body}`))
          }
        }
      })
      .catch(function (error) {
        reject(new Error(`HTTP request failed: ${error.message}`))
      })
  })
}

exports.func = function (args) {
  const jar = args.jar
  return getPremium(jar, args.userId)
}

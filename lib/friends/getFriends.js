// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Docs
/**
 * ✅ Get the friends of a user
 * @category User
 * @alias getFriends
 * @param {number} userId - The id of the user whose friends are being returned.
 * @returns {Promise<Friends>}
 * @example const noblox = require("noblox.js")
 * let friends = await noblox.getFriends(123456)
**/

// Define
function getFriends (jar, userId, apiUrl) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//${apiUrl}/v1/users/${userId}/friends`,
      options: {
        method: 'GET',
        jar,
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(res.body)
            response.data = response.data.map((entry) => {
              entry.created = new Date(entry.created)
              return entry
            })
            resolve(response)
          } catch (error) {
            reject(new Error('Failed to parse JSON response'))
          }
        } else {
          let errorMessage = `HTTP ${res.statusCode}`
          try {
            const body = JSON.parse(res.body)
            if (body.errors && body.errors.length > 0) {
              const errors = body.errors.map((e) => e.message).join(', ')
              errorMessage += `: ${errors}`
            }
          } catch (error) {
            errorMessage += ': Invalid JSON in error response'
          }
          reject(new Error(errorMessage))
        }
      })
      .catch(function (err) {
        reject(new Error(`Request failed: ${err.message}`))
      })
  })
}

exports.func = function (args) {
  let apiUrl = 'friends.roblox.com'
  if (args.apiUrl) {
    apiUrl = args.apiUrl
  }
  return getFriends(args.jar, args.userId, apiUrl)
}

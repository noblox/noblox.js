// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userId']

// Docs
/**
 * ✅ Get base-level user profile information
 * @category User
 * @alias getUserInfo
 * @param { number } userId
 * @returns {Promise<UserInfo>}
**/

// Define
exports.func = function (userId) {
  const httpOpt = {
    url: `//users.roblox.com/v1/users/${userId}`,
    options: {
      json: true,
      method: 'GET',
      resolveWithFullResponse: true
    }
  }

  return http(httpOpt).then(function (res) {
    if (res.statusCode !== 200) { throw new Error(`Failed to fetch user information: ${res.body.errors?.join(', ')}`) }

    return res
  })
}
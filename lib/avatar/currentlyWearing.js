const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['userId']

// Docs
/**
 * ✅ Get the assets a given user is wearing.
 * @category Avatar
 * @alias currentlyWearing
 * @param {number} userId - The user's userId.
 * @returns {Promise<AssetIdList>}
 * @example const noblox = require("noblox.js")
 * const wearingAssets = await noblox.currentlyWearing(1)
**/

exports.func = (args) => {
  const userId = args.userId

  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/currently-wearing',
    options: {
      method: 'GET',
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
    } else {
      throw new RobloxAPIError(res)
    }
  })
}

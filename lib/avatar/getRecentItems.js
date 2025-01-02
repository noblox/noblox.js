const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.optional = ['listType', 'jar']

// Docs
/**
 * 🔐 Get assets you've recently worn.
 * @category Avatar
 * @alias getRecentItems
 * @param {number=} listType - A type of item. Ex: Shirt, All
 * @returns {Promise<AssetRecentItemsResult>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const recentlyWorn = await noblox.getRecentItems("All")
**/

exports.func = (args) => {
  const jar = args.jar
  const listType = typeof (args.listType) === 'string' ? args.listType : 'All'

  return http({
    url: '//avatar.roblox.com/v1/recent-items/' + listType + '/list',
    options: {
      method: 'GET',
      jar,
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

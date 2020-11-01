const http = require('../util/http.js').func

exports.optional = ['listType', 'jar']

// Docs
/**
 * Get assets you've recently worn.
 * @category Avatar
 * @alias getRecentItems
 * @param {number=} listType - A type of item. Ex: Shirt, All
 * @returns {Promise<AssetRecentItemsResult>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * const recentlyWorn = await noblox.getRecentItems("All")
**/

exports.func = (args) => {
  const jar = args.jar
  const listType = typeof (args.listType) === 'string' ? args.listType : 'All'

  return http({
    url: '//avatar.roblox.com/v1/recent-items/' + listType + '/list',
    options: {
      method: 'GET',
      jar: jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 401) {
      throw new Error('You are not logged in')
    } else if (res.statusCode === 400) {
      throw new Error('Invalid list type')
    } else {
      return JSON.parse(res.body)
    }
  })
}

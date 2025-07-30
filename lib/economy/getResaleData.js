// Includes
const http = require('../util/http').func
const RobloxAPIError = require('../util/apiError')

// Args
exports.required = ['assetId']
exports.optional = ['jar']

// Docs
/**
 * ✅ Get the recent sale history (price and volume per day for 180 days) of a limited asset.
 * @category Assets
 * @alias getResaleData
 * @param {number} assetId - The id of the asset.
 * @returns {Promise<ResaleDataResponse>}
 * @example const noblox = require("noblox.js")
 * const resaleData = await noblox.getResaleData(20573078)
**/

// Define
const getResaleData = async (assetId) => {
  return http({
    url: `//economy.roblox.com/v1/assets/${assetId}/resale-data`,
    options: {
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      const resaleData = JSON.parse(res.body)
      for (const priceDataPoint of resaleData.priceDataPoints) {
        priceDataPoint.date = new Date(priceDataPoint.date)
      }
      for (const volumeDataPoint of resaleData.volumeDataPoints) {
        volumeDataPoint.date = new Date(volumeDataPoint.date)
      }
      return resaleData
    } else {
      throw new RobloxAPIError(res)
    }
  })
}

exports.func = function ({ assetId }) {
  if (isNaN(assetId)) {
    throw new Error('The provided assetId is not a number.')
  }
  return getResaleData(assetId)
}

// Includes
const http = require('../util/http').func

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
  }).then(({ body, statusCode }) => {
    const { errors } = body
    if (statusCode === 200) {
      try {
        const resaleData = body
        for (const priceDataPoint of resaleData.priceDataPoints) {
          priceDataPoint.date = new Date(priceDataPoint.date)
        }
        for (const volumeDataPoint of resaleData.volumeDataPoints) {
          volumeDataPoint.date = new Date(volumeDataPoint.date)
        }
        return resaleData
      } catch (err) {
        throw new Error(`An unknown error occurred with getResaleData() | [${statusCode}] assetId: ${assetId}`)
      }
    } else if (statusCode === 400) {
      throw new Error(`${errors[0].message} | assetId: ${assetId}`)
    } else {
      throw new Error(`An unknown error occurred with getResaleData() | [${statusCode}] assetId: ${assetId}`)
    }
  })
}

exports.func = function ({ assetId }) {
  if (isNaN(assetId)) {
    throw new Error('The provided assetId is not a number.')
  }
  return getResaleData(assetId)
}

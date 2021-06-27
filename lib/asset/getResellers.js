// Includes
const getPageResults = require('../util/getPageResults.js').func

// Args
exports.required = ['assetId']
exports.optional = ['limit', 'cursor']

// Docs
/**
 * 🔐 Gets available resale copies of a limited asset.
 * @category Assets
 * @alias getResellers
 * @param {number} assetId - The id of the asset.
 * @param {Limit=} limit - The max number of resellers to return.
 * @returns {Promise<ResellerData[]>}
 * @example const noblox = require("noblox.js")
 * const resellers = await noblox.getResellers(20573078)
**/

// Define
const getResellers = async (assetId, limit, jar) => {
  return getPageResults({
    url: `//economy.roblox.com/v1/assets/${assetId}/resellers`,
    limit: limit
  })
}

exports.func = function ({ assetId, limit, jar }) {
  if (isNaN(assetId)) {
    throw new Error('The provided assetId ID is not a number.')
  }
  return getResellers(assetId, limit, jar)
}

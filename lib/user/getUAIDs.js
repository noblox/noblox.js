// Includes
const getCollectibles = require('./getCollectibles.js').func

// Args
exports.required = ['userId', 'assetIds']
exports.optional = ['exclusionList', 'jar']

// Docs
/**
 * Get a UAID for a specific asset.
 * @category User
 * @alias getUAID
 * @param {number} userId - The id of the user to search.
 * @param {Array} assetIds - The ids of the assets to retrieve.
 * @param {Array=} exclusionList - The UAIDs to exclude from the search.
 * @returns {Promise<UAIDResponse>}
 * @example const noblox = require("noblox.js")
 * const UAIDInfo = await noblox.getUAIDs(80231025, [1974901902, 4255053867, 2705893733, 1532395])
**/

// Define
exports.func = function (args) {
  return getCollectibles({ userId: args.userId }).then(function (collectibles) {
    const retrievedIds = []
    const requestedIds = args.assetIds
    const excludedIds = args.exclusionList || []

    for (let index = 0; index < collectibles.length; index++) {
      const collectible = collectibles[index]
      const requestIndex = requestedIds.indexOf(collectible.assetId)

      if (requestIndex > -1 && excludedIds.indexOf(collectible.userAssetId) === -1) {
        requestedIds.splice(requestIndex, 1)
        retrievedIds.push(collectible.userAssetId)
      }
    }

    return {
      uaids: retrievedIds,
      failedIds: requestedIds
    }
  })
}

// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken').func
const configureItem = require('../develop/configureItem.js').func

// Args
exports.required = ['data']
exports.optional = ['itemOptions', 'assetId', 'jar']

// Docs
/**
 * 🔐 Upload an animation, either as a new asset or by overwriting an existing animation.
 * @category Asset
 * @alias uploadAnimation
 * @param {string | Stream} data - The rbxm file containing the KeyframeSequence.
 * @param {object=} itemOptions - The options for the upload. Only optional if assetId is not provided.
 * @param {string=} itemOptions.name - The name of the animation.
 * @param {string=} itemOptions.description - The description for the animation.
 * @param {boolean=} itemOptions.copyLocked - If the animation is copy-locked.
 * @param {boolean=} itemOptions.allowComments - If comments are allowed.
 * @param {number=} itemOptions.groupId - The group to upload the animation to. This is ignored if the assetId is provided.
 * @param {number=} assetId - An existing assetId to overwrite.
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * const fs = require("fs")
 * // Login using your cookie
 * const assetId = await noblox.uploadAnimation(fs.readFileSync("./KeyframeSequence.rbxm"), {
 *  name: "A cool animation",
 *  description: "This is a very cool animation",
 *  copyLocked: false, //The asset is allowed to be copied.
 *  allowComments: false
 * }, 7132858975)
**/

// Define
function upload(data, itemOptions, assetId, jar, token) {
  // Helper function to perform the actual upload
  function performUpload(uploadData, options) {
    if (!options) {
      throw new Error('ItemOptions is required for uploads.')
    }

    const copyLocked = options.copyLocked
    const allowComments = options.allowComments

    const uploadUrl = 'https://www.roblox.com/ide/publish/uploadnewanimation?' +
      'AllID=1&assetTypeName=Animation&isGamesAsset=False&' +
      'name=' + encodeURIComponent(options.name || 'Animation') +
      '&description=' + encodeURIComponent(options.description || '') +
      '&ispublic=' + (copyLocked != null ? !copyLocked : false) +
      '&allowComments=' + (allowComments != null ? allowComments : true) +
      '&groupId=' + (options.groupId || '')

    const httpOpt = {
      url: uploadUrl,
      options: {
        resolveWithFullResponse: true,
        method: 'POST',
        jar,
        body: uploadData,
        headers: {
          'X-CSRF-TOKEN': token,
          'Content-Type': 'application/xml',
          'User-Agent': 'RobloxStudio/WinInet RobloxApp/0.483.1.425021 (GlobalDist; RobloxDirectDownload)'
        }
      }
    }

    return http(httpOpt)
      .then(function(res) {
        if (res.statusCode === 200) {
          return Number(res.body)
        } else {
          throw new Error('Animation upload failed, confirm that all item options, asset options, and upload data are valid.')
        }
      })
  }

  // If updating existing animation, download current data first
  if (assetId) {
    const downloadOpt = {
      url: `https://assetdelivery.roblox.com/v1/asset/?id=${assetId}`,
      options: {
        method: 'GET',
        jar,
        encoding: null // Important: get raw binary data
      }
    }

    return http(downloadOpt)
      .then(function(downloadRes) {
        if (downloadRes.statusCode !== 200) {
          throw new Error(`Failed to download existing asset ${assetId}`)
        }

        // Use downloaded data and upload with new parameters
        return performUpload(downloadRes.body, itemOptions)
      })
  } else {
    // Upload new animation with provided data
    return performUpload(data, itemOptions)
  }
}

exports.func = function(args) {
  const jar = args.jar
  return getGeneralToken({
    jar
  }).then(function(token) {
    return upload(args.data, args.itemOptions, args.assetId, args.jar, token)
  })
}

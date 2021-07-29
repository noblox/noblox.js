// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken').func
const configureItem = require('./configureItem.js').func

// Args
exports.required = ['data']
exports.optional = ['itemOptions', 'asset', 'jar']

// Docs
/**
 * 🔐 Upload an animation.
 * @category Assets
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
function upload (data, itemOptions, assetId, jar, token) {
  const httpOpt = {
    url: assetId ? `//www.roblox.com/ide/publish/uploadexistinganimation?assetID=${assetId}&isGamesAsset=False` : '//www.roblox.com/ide/publish/uploadnewanimation?AllID=1',
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar,
      body: data,
      headers: {
        'X-CSRF-TOKEN': token,
        'Content-Type': 'application/xml',
        'User-Agent': 'RobloxStudio/WinInet RobloxApp/0.483.1.425021 (GlobalDist; RobloxDirectDownload)'
      }
    }
  }

  if (!assetId && itemOptions) {
    const copyLocked = itemOptions.copyLocked
    const allowComments = itemOptions.allowComments
    httpOpt.url += '&assetTypeName=Animation&genreTypeId=1&name=' +
      itemOptions.name +
      '&description=' +
      (itemOptions.description || '') +
      '&ispublic=' +
      (copyLocked != null ? !copyLocked : false) +
      '&allowComments=' +
      (allowComments != null ? allowComments : true) +
      '&groupId=' +
      (itemOptions.groupId || '')
  } else if (!assetId) {
    throw new Error('ItemOptions is required for new assets.')
  }

  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        const resultId = assetId || Number(res.body)

        if (assetId && itemOptions) {
          const copyLocked = itemOptions.copyLocked
          const allowComments = itemOptions.allowComments

          return configureItem({
            id: resultId,
            name: itemOptions.name,
            description: itemOptions.description,
            enableComments: (allowComments != null ? allowComments : true),
            sellForRobux: (copyLocked != null ? !copyLocked : false)
          }).then(function () {
            return resultId
          })
        } else {
          return resultId
        }
      } else {
        throw new Error('Animation upload failed, confirm that all item options, asset options, and upload data are valid.')
      }
    })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({
    jar
  }).then(function (token) {
    return upload(args.data, args.itemOptions, args.assetId, args.jar, token)
  })
}

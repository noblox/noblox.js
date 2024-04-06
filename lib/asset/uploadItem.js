// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const pollResult = require('../util/pollResult.js').func

// Args
exports.required = ['name', 'assetType', 'file', 'creator']
exports.optional = ['description', 'jar']

// Docs
/**
 * 🔐 Upload an item.
 * @category Asset
 * @alias uploadItem
 * @param {string} name - The name of the asset.
 * @param {UploadItemAssetType} assetType - The type of asset.
 * @param {Buffer | String} file - The file to upload.
 * @param {AssetCreatorContext} creator - The creator to upload under.
 * @param {String=} description - The description of the asset.
 * @returns {Promise<UploadItemResponse>}
 * @example const noblox = require("noblox.js")
 * const fs = require("fs")
 * // Login using your cookie
 * await noblox.uploadItem("A cool decal.", "Decal", fs.readFileSync("./Image.png"), { userId: 1 }, "Cool description here")
**/

// Define
function uploadItem (name, assetType, file, creator, description, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    form.append('request', JSON.stringify({ 
      assetType: assetType,
      displayName: name,
      description: description || '',
      creationContext: { creator }
    }))
    form.append('fileContent', new Blob([ file ], ['Animation', 'Model' ].includes(assetType) ? { type: 'model/x-rbxm' } : undefined), 'cool.png')

    return http({
      url: 'https://apis.roblox.com/assets/user-auth/v1/assets',
      options: {
        method: 'POST',
        body: form,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        },
        resolveWithFullResponse: true,
        jar
      }
    }).then(function (res) {
      if (res.status !== 200) {
        return reject(res?.body?.message || res?.body?.error || res?.body?.toString())
      }

      resolve(pollResult({ url: `https://apis.roblox.com/assets/user-auth/v1/${res.body.path}` }))
    }).catch(reject)
  })
}

exports.func = function (args) {
  const { jar } = args
  return getGeneralToken({ jar })
    .then(function (xcsrf) {
      return uploadItem(args.name, args.assetType, args.file, args.creator, args.description, jar, xcsrf)
    })
}

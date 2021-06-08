// Includes
const http = require('../util/http.js').func
const getVerification = require('../util/getVerification.js').func

// Args
exports.required = ['name', 'assetType', 'file']
exports.optional = ['groupId', 'jar']

// Docs
/**
 * 🔐 Upload an item.
 * @category Assets
 * @alias uploadItem
 * @param {string} name - The name of the asset.
 * @param {number} assetType - The [id for the asset type]{@link https://developer.roblox.com/en-us/api-reference/enum/AssetType}.
 * @param {ReadStream} file - The read stream for the asset being uploaded.
 * @param {number=} groupId - The group to upload the asset to.
 * @returns {Promise<UploadItemResponse>}
 * @example const noblox = require("noblox.js")
 * const fs = require("fs")
 * // Login using your cookie
 * noblox.uploadItem("A cool decal.", 13, fs.createReadStream("./Image.png"))
**/

// Define
function uploadItem (jar, file, name, assetType, groupId) {
  return new Promise((resolve, reject) => {
    return getVerification({
      url: 'https://www.roblox.com/build/upload',
      options: {
        jar: jar
      }
    }).then(function (ver) {
      const data = {
        name: name,
        assetTypeId: assetType,
        groupId: groupId || '',
        __RequestVerificationToken: ver.inputs.__RequestVerificationToken,
        file: {
          value: file,
          options: {
            filename: 'Image.png',
            contentType: 'image/png'
          }
        }
      }
      return http({
        url: '//www.roblox.com/build/upload',
        options: {
          method: 'POST',
          verification: ver.header,
          formData: data,
          resolveWithFullResponse: true,
          jar: jar
        }
      }).then(function (res) {
        if (res.statusCode === 302) {
          const location = res.headers.location
          const errMsg = location.match('uploadedId=(.*)$')
          const match = location.match(/\d+$/)
          if (match) {
            const id = parseInt(match[0], 10)
            if (location.indexOf('/build/upload') === -1) {
              reject(new Error('Unknown redirect: ' + location))
            }
            resolve(id)
          } else if (errMsg) {
            reject(new Error('Upload error: ' + decodeURI(errMsg[1])))
          } else {
            reject(new Error('Match error. Original: ' + location))
          }
        } else {
          reject(new Error('Unknown upload error'))
        }
      })
    })
  })
}

exports.func = function (args) {
  return uploadItem(args.jar, args.file, args.name, args.assetType, args.groupId)
}

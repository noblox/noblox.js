// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken').func

// Args
exports.required = ['data']
exports.optional = ['itemOptions', 'asset', 'jar']

// Docs
/**
 * Upload a model.
 * @category Assets
 * @alias uploadModel
 * @param {string | Stream} data - The model data.
 * @param {Object=} itemOptions - The options for the upload.
 * @param {string=} itemOptions.name - The name of the model.
 * @param {string=} itemOptions.description - The description for the model.
 * @param {boolean=} itemOptions.copyLocked - If the model is copylocked.
 * @param {boolean=} itemOptions.allowComments - If comments are allowed.
 * @param {number=} itemOptions.groupId - The group to upload the model to.
 * @param {number=} assetId - An existing assetId to overwrite.
 * @returns {Promise<UploadModelResponse>}
 * @example const noblox = require("noblox.js")
 * const fs = require("fs")
 * // Login using your cookie
 * noblox.uploadModel(fs.readFileSync("./model.rbxm"), {
 *  name: "A cool model",
 *  description: "This is a very cool model",
 *  copyLocked: false, //The asset is allowed to be copied.
 *  allowComments: false,
 *  groupId: 1
 * }, 1117747196)
**/

// Define
function upload (data, itemOptions, asset, jar, token) {
  const httpOpt = {
    url: '//data.roblox.com/Data/Upload.ashx?json=1&assetid=' + (asset || 0),
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar,
      body: data,
      headers: {
        'X-CSRF-TOKEN': token,
        'Content-Type': 'application/xml'
      }
    }
  }
  if (itemOptions) {
    const copyLocked = itemOptions.copyLocked
    const allowComments = itemOptions.allowComments
    httpOpt.url += '&type=Model&genreTypeId=1&name=' +
      itemOptions.name +
      '&description=' +
      (itemOptions.description || '') +
      '&ispublic=' +
      (copyLocked != null ? !copyLocked : false) +
      '&allowComments=' +
      (allowComments != null ? allowComments : true) +
      '&groupId=' +
      (itemOptions.groupId || '')
  } else if (!asset) {
    throw new Error('ItemOptions is required for new assets.')
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        const body = res.body
        let parsed
        try {
          parsed = JSON.parse(body)
        } catch (e) {
          throw new Error('Could not parse JSON, returned body:' + body)
        }
        return parsed
      } else {
        throw new Error('Upload failed, confirm that all item options, asset options, and upload data are valid.')
      }
    })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({
    jar
  }).then(function (token) {
    return upload(args.data, args.itemOptions, args.asset, args.jar, token)
  })
}

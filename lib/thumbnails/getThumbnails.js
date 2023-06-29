// Includes
const http = require('../util/http.js').func
const { thumbnail: settings } = require('../../settings.json')

// Args
exports.required = ['thumbnailRequests']
exports.optional = []

// Docs
/**
 * ✅ Get thumbnails for assets/players.
 * @category Assets
 * @alias getThumbnails
 * @param {Array<ThumbnailRequest>} thumbnailRequests - The id or an array ids of thumbnails to be retrieved; 100
 * @returns {Promise<ThumbnailData[]>}
 * @example const noblox = require("noblox.js")
 * const playerThumbnails = noblox.getThumbnails([
 *  {
 *    type: "AvatarHeadShot",
 *    token: "270FF19ECB1AFCF25383A6F37C6AD307",
 *    format: "png",
 *    size: "150x150"
 *   }, {
 *    type: "AvatarBust",
 *    targetId: 55549140,
 *    isCircular: true,
 *    format: "png",
 *    size: "150x150"
 *   }
 * ])
**/

// Define
function getThumbnails (requests, retryCount = settings.maxRetries) {
  if (!Array.isArray(requests)) {
    throw new Error('thumbnailRequests are not an array')
  }

  requests = [...new Set(requests)]
  if (requests.length > 100) {
    throw new Error(`Too many thumbnailRequests provided (${requests.length}); maximum 100`)
  }

  for (const request of requests) {
    if (!request.size || !request.type) {
      throw new Error('thumbnailRequest must have a size and type')
    } else if (request.format && (request.format.toLowerCase() !== 'png' && request.format.toLowerCase() !== 'jpeg')) {
      throw new Error(`Invalid image type provided: ${request.format} | Use: png, jpeg`)
    }
  }

  return http({
    url: 'https://thumbnails.roblox.com/v1/batch',
    options: {
      method: 'POST',
      json: requests,
      resolveWithFullResponse: true,
      followRedirect: true
    }
  })
    .then(async ({ status, data: resData }) => {
      let { data, errors } = resData
      if (status === 200) {
        if (retryCount > 0) {
          const pendingThumbnails = data.filter(obj => { return obj.state === 'Pending' }).map(obj => obj.targetId) // Get 'Pending' thumbnails as array of userIds
          if (pendingThumbnails.length > 0) {
            await timeout(settings.retryDelay) // small delay helps cache populate on Roblox's end; default 500ms
            const updatedPending = await getThumbnails(pendingThumbnails, --retryCount) // Recursively retry for # of maxRetries attempts; default 2
            data = data.map(obj => updatedPending.find(o => o.targetId === obj.targetId) || obj) // Update primary array's values
          }
        }
        data = data.map(obj => {
          if (obj.state !== 'Completed') {
            obj.imageUrl = settings.failedUrl[obj.state.toLowerCase()] || obj.imageUrl
          }
          return obj
        })
        return data
      } else if (status === 400) {
        throw new Error(`Error Code ${errors.code}: ${errors.message} | requests: ${JSON.stringify(requests)}`)
      } else {
        throw new Error(`An unknown error occurred with getThumbnails() | requests: ${JSON.stringify(requests)}`)
      }
    })
}

function timeout (ms) {
  return new Promise(resolve => { setTimeout(resolve, ms) })
}

exports.func = function ({ thumbnailRequests }) {
  return getThumbnails(thumbnailRequests)
}

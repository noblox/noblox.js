// Includes
const http = require('../util/http.js').func
const { thumbnail: settings } = require('../../settings.json')

// Args
exports.required = ['userIds']
exports.optional = ['size', 'format', 'isCircular', 'cropType', 'retryCount']

// Variables
const eligibleSizes = {
  data: {
    sizes: ['30x30', '48x48', '60x60', '75x75', '100x100', '110x110', '140x140', '150x150', '150x200', '180x180', '250x250', '352x352', '420x420', '720x720'],
    endpoint: 'avatar'
  },
  bust: {
    sizes: ['48x48', '50x50', '60x60', '75x75', '100x100', '150x150', '180x180', '352x352', '420x420'],
    endpoint: 'avatar-bust'
  },
  headshot: {
    sizes: ['48x48', '50x50', '60x60', '75x75', '100x100', '110x110', '150x150', '180x180', '352x352', '420x420', '720x720'],
    endpoint: 'avatar-headshot'
  }
}

// Docs
/**
 * ✅ Get a user's thumbnail.
 * @category User
 * @alias getPlayerThumbnail
 * @param {number | Array<number>} userIds - The id or an array ids of thumbnails to be retrieved; 100
 * @param {number | string=} [size=720x720] - The [size of the image to be returned]{@link https://noblox.js.org/thumbnailSizes.png}; defaults highest resolution
 * @param {'png' | 'jpeg'=} [format=png] - The file format of the returned thumbnails
 * @param {boolean=} [isCircular=false] - Return the circular version of the thumbnails
 * @param {'data' | 'Bust' | 'Headshot'=} [cropType=data] - The style of thumbnail that will be returned
 * @returns {Promise<PlayerThumbnailData[]>}
 * @example const noblox = require("noblox.js")
 * let thumbnail_default = await noblox.getPlayerThumbnail(2416399685)
 * let thumbnail_circHeadshot = await noblox.getPlayerThumbnail(2416399685, 420, "png", true, "Headshot")
 * let thumbnails_data = await noblox.getPlayerThumbnail([2416399685, 234567, 345678], "150x200", "jpeg", false, "data")
**/

// Define
function getPlayerThumbnail (userIds, size, format = 'png', isCircular = false, cropType = 'data', retryCount = settings.maxRetries) {
  // Validate userIds
  if (Array.isArray(userIds)) {
    if (userIds.some(isNaN)) {
      throw new Error('userIds must be a number or an array of numbers')
    }
    userIds = [...new Set(userIds)] // get rid of duplicates, endpoint response does this anyway
    if (userIds.length > 100) {
      throw new Error(`too many userIds provided (${userIds.length}); maximum 100`)
    }
  } else {
    if (isNaN(userIds)) {
      throw new Error('userId is not a number')
    }
    userIds = [userIds]
  }

  // Validate cropType
  cropType = cropType.toLowerCase()
  if (!Object.keys(eligibleSizes).includes(cropType)) {
    throw new Error(`Invalid cropping type provided: ${cropType} | Use: ${Object.keys(eligibleSizes).join(', ')}`)
  }
  const { sizes, endpoint } = eligibleSizes[cropType]

  // Validate size
  size = size || sizes[sizes.length - 1]
  if (typeof size === 'number') {
    size = `${size}x${size}`
  }
  if (!sizes.includes(size)) {
    throw new Error(`Invalid size parameter provided: ${size} | [${cropType.toUpperCase()}] Use: ${sizes.join(', ')}`)
  }

  // Validate format
  if (format.toLowerCase() !== 'png' && format.toLowerCase() !== 'jpeg') {
    throw new Error(`Invalid image type provided: ${format} | Use: png, jpeg`)
  }

  return http({
    url: `https://thumbnails.roblox.com/v1/users/${endpoint}?userIds=${userIds.join(',')}&size=${size}&format=${format}&isCircular=${!!isCircular}`,
    options: {
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
            const updatedPending = await getPlayerThumbnail(pendingThumbnails, size, format, isCircular, cropType, --retryCount) // Recursively retry for # of maxRetries attempts; default 2
            data = data.map(obj => updatedPending.find(o => o.targetId === obj.targetId) || obj) // Update primary array's values
          }
        }
        data = data.map(obj => {
          if (obj.state !== 'Completed') {
            const settingsUrl = settings.failedUrl[obj.state.toLowerCase()] // user defined settings.json default image URL for blocked or pending thumbnails; default ""
            obj.imageUrl = settingsUrl || `https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_${size}.png`
          }
          return obj
        })
        return data
      } else if (status === 400) {
        throw new Error(`Error Code ${errors.code}: ${errors.message} | endpoint: ${endpoint}, userIds: ${userIds.join(',')}, size: ${size}, isCircular: ${!!isCircular}`)
      } else {
        throw new Error(`An unknown error occurred with getPlayerThumbnail() | endpoint: ${endpoint}, userIds: ${userIds.join(',')}, size: ${size}, isCircular: ${!!isCircular}`)
      }
    })
}

function timeout (ms) {
  return new Promise(resolve => { setTimeout(resolve, ms) })
}

exports.func = function ({ userIds, size, format, isCircular, cropType, retryCount }) {
  return getPlayerThumbnail(userIds, size, format, isCircular, cropType, retryCount)
}

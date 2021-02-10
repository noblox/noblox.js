// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['userIds', 'size']
exports.optional = ['format', 'isCircular', 'isHeadshot']

// Docs
/**
 * Get a user's thumbnail.
 * @category User
 * @alias getPlayerThumbnail
 * @param {number|array} userIds - The id or id of the user whose thumbnail is being fetched. (For multiple ids, put them in an array)
 * @param {(30|48|60|75|100|110|140|150|180|250|352|420|720)} size - The size of the image that will be returned.
 * @param {'png' | 'jpeg'=} [format=png] - The format that the image will be returned in.
 * @param {boolean=} [isCircular=false] - Will return a circular image if true.
 * @param {boolean=} [isHeadshot=false] - Will return a palyer's headshot instead of a full body thumbnail.
 * @returns {Promise<playerThumbnailData[]>}
 * @example const noblox = require("noblox.js")
 * let thumbnails = await noblox.getPlayerThumbnail([123456, 234567, 345678], 30, "jpeg", false)
**/

// Define
exports.func = function (args) {
  if (!Array.isArray(args.userIds)) {
    if (typeof args.userIds === 'number') {
      args.userIds = [args.userIds]
    } else {
      throw new Error('userIds can be a number or an array of numbers only')
    }
  }
  if (isNaN(args.size)) {
    throw new Error('Size is not a number')
  }
  const eligibleSizes = [720, 420, 352, 250, 180, 150, 140, 110, 100, 75, 60, 48, 30]
  if (!eligibleSizes.includes(args.size)) {
    throw new Error(`You are using an ineligible size\nValid sizes: ${eligibleSizes.join(', ')}`)
  }
  if (!args.format) {
    args.format = 'Png'
  }
  if (args.format.toLowerCase() !== 'png' && args.format.toLowerCase() !== 'jpeg') {
    throw new Error('Incorrect format type')
  }
  return http({
    url: `https://thumbnails.roblox.com/v1/users/avatar${args.isHeadshot ? '-headshot' : ''}?userIds=${args.userIds.join(',')}&size=${args.size}x${args.size}&format=${args.format}&isCircular=${!!args.isCircular}`,
    options: {
      resolveWithFullResponse: true,
      followRedirect: true
    }
  })
    .then(function (res) {
      if (res.statusCode === 200) {
        const json = JSON.parse(res.body)
        if (!json.data.length) {
          throw new Error('Users are invalid')
        } else {
          return json.data
        }
      }
    })
}

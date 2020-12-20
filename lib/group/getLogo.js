// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['group']
exports.optional = ['size', 'circular', 'format']

// Docs
/**
 * Get the group's logo.
 * @category Group
 * @alias getLogo
 * @param {number} group - The id of the group.
 * @param {GroupIconSize=} [size=150x150] - The size of the logo.
 * @param {boolean=} [circular=false] - Get the circular version of the logo.
 * @param {GroupIconFormat=} [format=Png] - The file format of the logo.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * const logo = await noblox.getLogo(1)
**/

// Define
function getLogo (group, size, circular, format) {
  const httpOpt = {
    url: '//thumbnails.roblox.com/v1/groups/icons',
    options: {
      qs: {
        groupIds: group,
        size: size || '150x150',
        format: format || 'Png',
        isCircular: circular
      },
      json: true
    }
  }
  return http(httpOpt)
    .then(function (body) {
      const error = body.errors && body.errors[0]

      if (error) {
        if (error.message === 'NotFound') {
          throw new Error('An invalid UserID or GroupID was provided.')
        } else {
          throw new Error(error.message)
        }
      }

      const thumbnailData = body.data[0]

      if (thumbnailData.state !== 'Completed') {
        throw new Error('The requested image has not been approved. Status: ' + thumbnailData.state)
      }

      return thumbnailData.imageUrl
    })
}

exports.func = function (args) {
  return getLogo(args.group)
}

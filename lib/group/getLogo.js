// Includes
const http = require('../util/http.js').func

// Args
exports.required = ['group']
exports.optional = ['size', 'circular', 'format']

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

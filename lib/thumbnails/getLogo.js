// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['group']
exports.optional = ['size', 'circular', 'format']

// Docs
/**
 * ✅ Get the group's logo.
 * @category Group
 * @alias getLogo
 * @param {number || number[]} group - The id(s) of the group.
 * @param {GroupIconSize=} [size=150x150] - The size of the logo.
 * @param {boolean=} [circular=false] - Get the circular version of the logo.
 * @param {GroupIconFormat=} [format=Png] - The file format of the logo.
 * @returns {Promise<string> || Promise<string[]>}
 * @example const noblox = require("noblox.js")
 * const logo = await noblox.getLogo(1)
**/

// Define
function getLogo (group, size, circular, format) {
  const groupIds = Array.isArray(group) ? group.join(',') : group
  const httpOpt = {
    url: '//thumbnails.roblox.com/v1/groups/icons',
    options: {
      qs: {
        groupIds,
        size: size || '150x150',
        format: format || 'Png',
        isCircular: circular
      },
      json: true,
      resolveWithFullResponse: true
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode !== 200) {
        throw new RobloxAPIError(res)
      }

      const urls = []

      for (const thumb of res.body.data) {
        if (thumb.state !== 'Completed') {
          throw new Error(`The requested image for group ${thumb.targetId} has not been approved. State: ${thumb.state}`)
        }

        urls.push(thumb.imageUrl)
      }

      return urls.length > 1 ? urls : urls.at(0)
    })
}

exports.func = function (args) {
  return getLogo(args.group)
}

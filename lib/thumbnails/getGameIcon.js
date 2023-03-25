// Includes
const http = require('noblox.js/lib/util/http.js').func

// Args
exports.required = ['game']
exports.optional = ['size', 'circular', 'format']

// Docs
/**
 * ✅ Get the game's icon.
 * @category Games
 * @alias getGameIcon
 * @param {number} game - The id of the universe.
 * @param {string=} [size=150x150] - The size of the icon.
 * @param {boolean=} [circular=false] - Get the circular version of the icon.
 * @param {'png' | 'jpeg'=} [format=Png] - The file format of the icon.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * const icon = await noblox.getGameIcon(1)
**/

// Define
function getGameIcon (game, size, circular, format) {
  const httpOpt = {
    url: `https://thumbnails.roblox.com/v1/games/icons?universeIds=${game}&size=${size || '150x150'}&format=${format || 'Png'}&isCircular=${!!circular}`,
    options: {
      json: true
    }
  }
  return http(httpOpt)
    .then(function (body) {
      const error = body.errors && body.errors[0]

      if (error) {
        if (error.message === 'NotFound') {
          throw new Error('An invalid UniverseID was provided.')
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
  return getGameIcon(args.game)
}

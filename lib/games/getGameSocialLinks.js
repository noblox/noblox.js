// Includes
const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

// Args
exports.required = ['universeId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get the social link data associated with a game.
 * @category Game
 * @alias getGameSocialLinks
 * @param {number} universeId - The universe id of the game.
 * @returns {Promise<SocialLinkResponse[]>}
 * @see [getPlaceInfo()](global.html#getPlaceInfo) - can be used to convert a placeId to a universeId
 * @example const noblox = require("noblox.js")
 * const gameSocialLinks = await noblox.getGameSocialLinks(2615802125)
**/

// Define
function getGameSocialLinks (universeId, jar) {
  return http({
    url: `//games.roblox.com/v1/games/${universeId}/social-links/list`,
    options: {
      jar,
      resolveWithFullResponse: true
    }
  })
    .then((res) => {
      const { data } = JSON.parse(res.body)
      if (res.statusCode === 200) {
        return data
      } else {
        throw new RobloxAPIError(res)
      }
    })
}

exports.func = function ({ universeId, jar }) {
  return getGameSocialLinks(universeId, jar)
}

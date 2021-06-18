// Includes
const http = require('../util/http.js').func

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
      jar: jar,
      resolveWithFullResponse: true
    }
  })
    .then(({ statusCode, body }) => {
      const { errors, data } = JSON.parse(body)
      if (statusCode === 200 && data) {
        return data
      } else if (statusCode === 400 || statusCode === 403 || statusCode === 404) {
        throw new Error(`${errors[0].message} | universeId: ${universeId}`)
      } else if (statusCode === 401) {
        throw new Error(`${errors[0].message} (Are you logged in?) | universeId: ${universeId}`)
      } else {
        throw new Error(`An unknown error occurred with getGameSocialLinks() | [${statusCode}] universeId: ${universeId}`)
      }
    })
}

exports.func = function ({ universeId, jar }) {
  return getGameSocialLinks(universeId, jar)
}

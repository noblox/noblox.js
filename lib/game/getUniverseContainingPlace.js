// Includes
const http = require("../util/http").func

// Args
exports.required = ['gameId'];

// Docs
/**
 * Get universe id of place
 * @category Game
 * @param {number} placeId - The id of the place
 * @returns {Promise<number>}
 * @example const noblox = require("noblox.js")
 * const universeId = await noblox.getUniverseContainingPlace(1);
**/

// Define
function getUniverseContainingPlace(placeId) {
  const httpOpt = {
    url: "//api.roblox.com/universes/get-universe-containing-place?placeId=" + placeId,
    options: {
      resolveWithFullResponse: true,
      method: 'GET'
    }
  }

  return http(httpOpt)
    .then(function (res) {
      let body = JSON.parse(res.body);
      if (res.statusCode === 200) {
        resolve(body.UniverseId)
      } else if (res.statusCode === 400) {
        reject(new Error(`${res.statusCode} Bad Request`))
      } else if (res.statusCode == 500) {
        reject(new Error(`${res.statusCode} Internal Server Error`))
      }
    }).catch(error => reject(error));
}

exports.func = getUniverseContainingPlace;
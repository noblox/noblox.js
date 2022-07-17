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
      if (body.hasOwnProperty("UniverseId")) {
        return body.UniverseId;
      }

      return new Error(`${res.statusCode} ${res.body}`);
    }).catch(error => {
      return error;
    });
}

exports.func = getUniverseContainingPlace;
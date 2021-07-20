const http = require('../util/http.js').func

exports.required = ['outfitId']

// Docs
/**
 * ✅ Get the details of an outfit.
 * @category Avatar
 * @alias outfitDetails
 * @param {number} outfitId - The id of the outfit.
 * @returns {Promise<AvatarOutfitDetails>}
 * @example const noblox = require("noblox.js")
 * const outfit = await noblox.outfitDetails(111)
**/

exports.func = (args) => {
  const outfitId = args.outfitId

  return http({
    url: '//avatar.roblox.com/v1/outfits/' + outfitId + '/details',
    options: {
      method: 'GET',
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return JSON.parse(res.body)
    } else {
      throw new Error('Outfit does not exist')
    }
  })
}

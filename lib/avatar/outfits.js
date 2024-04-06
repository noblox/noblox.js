const http = require('../util/http.js').func

exports.required = ['userId']
exports.optional = ['page', 'itemsPerPage']

// Docs
/**
 * ✅ Get a user's outfits.
 * @category Avatar
 * @alias outfits
 * @param {number} userId - The userId of the user.
 * @param {number=} page - The page to index.
 * @param {number=} itemsPerPage - The number of results on each page.
 * @returns {Promise<GetOutfitsResult>}
 * @example const noblox = require("noblox.js")
 * const outfits = await noblox.outfits(1)
**/

exports.func = (args) => {
  const userId = args.userId
  const page = parseInt(args.page) ? parseInt(args.page) : '*'
  const itemsPerPage = parseInt(args.itemsPerPage) ? parseInt(args.itemsPerPage) : '*'

  return http({
    url: '//avatar.roblox.com/v1/users/' + userId + '/outfits?page=' + page + '&itemsPerPage=' + itemsPerPage,
    options: {
      method: 'GET',
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      return res.body
    } else {
      throw new Error('User does not exist')
    }
  })
}

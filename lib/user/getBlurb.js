// Includes
const http = require('../util/http.js').func
const parser = require('cheerio')

// Args
exports.required = ['userId']

// Docs
/**
 * Get a user's blurb - a user's description.
 * @category User
 * @alias getBlurb
 * @param {number} userId - The id of the user's blurb that is being retrieved.
 * @returns {Promise<string>}
 * @example const noblox = require("noblox.js")
 * let blurb = await noblox.getBlurb({userId: 123456})
**/

// Define
exports.func = function (args) {
  return http({
    url: '//www.roblox.com/users/' + args.userId + '/profile',
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  })
    .then(function (res) {
      if (res.statusCode === 200) {
        return parser.load(res.body)('.profile-about-content-text').text()
      } else {
        throw new Error('User does not exist')
      }
    })
}

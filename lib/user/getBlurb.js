// Includes
const http = require('../util/http.js').func
const parser = require('cheerio')
const Promise = require('bluebird')

// Args
exports.required = ['userId']

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

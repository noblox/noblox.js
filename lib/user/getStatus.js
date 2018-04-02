// Includes
var http = require('../util/http.js').func
var parser = require('cheerio')

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
        return parser.load(res.body)('div[data-statustext]').attr('data-statustext')
      } else {
        throw new Error('User does not exist')
      }
    })
}

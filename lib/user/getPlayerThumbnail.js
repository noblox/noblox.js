// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['userId', 'thumbnailType', 'size']

// Define
exports.func = function (args) {
  return http({
    url: 'https://www.roblox.com/' + args.thumbnailType + '-thumbnail/image?userId=' + args.userId + '&width=' + args.size + '&height=' + args.size + '&format=png true',
    options: {
      resolveWithFullResponse: true,
      followRedirect: true
    }
  })
    .then(function (res) {
      if (res.statusCode === 200) {
        return res.body
      } else {
        throw new Error('User does not exist')
      }
    })
}

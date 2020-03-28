// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['userId']

// Define
exports.func = function (args) {
  return http({
    url: '//www.roblox.com/users/profile/profileheader-json?userid=' + args.userId,
    options: {
      resolveWithFullResponse: true,
      followRedirect: false
    }
  })
    .then(function (res) {
      if (res.statusCode === 200) {
        return JSON.parse(res.body).UserStatus
      } else {
        throw new Error('User does not exist')
      }
    })
}

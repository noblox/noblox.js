// Includes
var http = require('./http.js').func

// Args
exports.optional = ['option', 'jar']

// Define
exports.func = function (args) {
  var jar = args.jar
  var option = args.option
  var httpOpt = {
    url: '//www.roblox.com/mobileapi/userinfo',
    options: {
      resolveWithFullResponse: true,
      method: 'GET',
      followRedirect: false,
      jar: jar
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode !== 200) {
        throw new Error('You are not logged in.')
      } else {
        var json = JSON.parse(res.body)
        var result = (option ? json[option] : json)
        return result
      }
    })
}

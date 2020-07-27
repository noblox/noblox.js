// Includes
const http = require('./http.js').func

// Args
exports.optional = ['option', 'jar']

// Define
exports.func = function (args) {
  const jar = args.jar
  const option = args.option
  const httpOpt = {
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
        const json = JSON.parse(res.body)
        return (option ? json[option] : json)
      }
    })
}

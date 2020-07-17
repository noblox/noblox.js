// Includes
var getHash = require('./getHash.js').func
var http = require('./http.js').func
var cache = require('../cache')

// Args
exports.optional = ['jar']

// Define
function getGeneralToken (jar) {
  var httpOpt = {
    // This will never actually sign you out because an X-CSRF-TOKEN isn't provided, only received
    url: '//auth.roblox.com/v1/logout', // REQUIRES https. Thanks for letting me know, ROBLOX...
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar
    }
  }
  return http(httpOpt)
    .then(function (res) {
      var xcsrf = res.headers['x-csrf-token']
      if (xcsrf) {
        return xcsrf
      } else {
        throw new Error('Did not receive X-CSRF-TOKEN')
      }
    })
}

exports.func = function (args) {
  var jar = args.jar
  return cache.wrap('XCSRF', getHash({ jar: jar }), function () {
    return getGeneralToken(jar)
  })
}

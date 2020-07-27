// Includes
const getHash = require('./getHash.js').func
const http = require('./http.js').func
const cache = require('../cache')
const options = require('../options.js')

// Args
exports.optional = ['jar']

// Define
function getGeneralToken (jar) {
  if (!jar && !options.jar.session) {
    throw new Error('Cannot get CSRF: You are not logged in.')
  }
  const httpOpt = {
    // This will never actually sign you out because an X-CSRF-TOKEN isn't provided, only received
    url: '//auth.roblox.com/v2/logout', // REQUIRES https. Thanks for letting me know, ROBLOX...
    options: {
      resolveWithFullResponse: true,
      method: 'POST',
      jar: jar
    }
  }
  return http(httpOpt)
    .then(function (res) {
      const xcsrf = res.headers['x-csrf-token']
      if (xcsrf) {
        return xcsrf
      } else {
        throw new Error('Did not receive X-CSRF-TOKEN')
      }
    })
}

exports.func = function (args) {
  const jar = args.jar
  return cache.wrap('XCSRF', getHash({ jar: jar }), function () {
    return getGeneralToken(jar)
  })
}

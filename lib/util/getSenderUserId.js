// Includes
var getCurrentUser = require('./getCurrentUser.js').func
var getHash = require('./getHash.js').func
var cache = require('../cache')

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var jar = args.jar
  return cache.wrap('SenderID', getHash({ jar: jar }), function () {
    return getCurrentUser({ jar: jar })
      .then(function (info) {
        return info.UserID
      })
  })
}

// Includes
const getCurrentUser = require('./getCurrentUser.js').func
const getHash = require('./getHash.js').func
const cache = require('../cache')

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  const jar = args.jar
  return cache.wrap('SenderID', getHash({ jar: jar }), function () {
    return getCurrentUser({ jar: jar })
      .then(function (info) {
        return info.UserID
      })
  })
}

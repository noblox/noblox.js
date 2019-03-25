// Dependencies
var crypto = require('crypto')

// Includes
var getSession = require('./getSession.js').func

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var session = getSession({ jar: args.jar })
  return crypto.createHash('md5').update(session).digest('hex')
}

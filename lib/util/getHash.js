// Dependencies
const crypto = require('crypto')

// Includes
const getSession = require('./getSession.js').func

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  const session = getSession({ jar: args.jar })
  return crypto.createHash('md5').update(session).digest('hex')
}

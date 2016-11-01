// Dependencies
var crypto = require('crypto');

// Includes
var options = require('../options.js');
var getSession = require('./getSession.js').func;

exports.optional = ['jar'];

exports.func = function (args) {
  var session = getSession({jar: args.jar || options.jar});
  return crypto.createHash('md5').update(session).digest('hex');
};

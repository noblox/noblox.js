// Dependencies
var request = require('request');

// Includes
var _login = require('./util/login.js'),
  _getSession = require('./util/getSession.js');

// Vars
var _jar = request.jar(); // Default cookie jar

// Define
function login(options,password,jar) {
  if (typeof options == 'object') {
    var j = options.jar;
    _login((j ? j : (j === true && _jar)),options.username,options.password);
  } else if (typeof options == 'string')
    _login((jar ? jar : (jar === true && _jar)),options,password);
}

function getSession(options) {
  if (options.hasOwnProperty('jar'))
    getSession(options.jar);
  else
    getSession(options);
}

// Export
module.exports = {
  login: login,
  getSession: getSession
};

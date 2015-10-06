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
    _login(options.username,options.password,(j ? j : (j === true && _jar)));
  } else if (typeof options == 'string')
    _login(options,password,(jar ? jar : (jar === true && _jar)));
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

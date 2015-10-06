// Dependencies
var request = require('request');

// Includes
var _login = require('./util/login.js'),
  getSession = require('./util/getSession.js');

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

// Export
module.exports = {
  login: login,
  getSession: getSession
};

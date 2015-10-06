// Dependencies
var request = require('request');

// Includes
var _login = require('./util/login.js'),
  _getSession = require('./util/getSession.js'),
  _getCurrentUser = require('./util/getCurrentUser.js'),
  _setRank = require('./setRank.js');

// Vars
var _jar = request.jar(); // Default cookie jar

// Define
function makeCallbackArray(options,success,failure,always) {
  return {success: options.success || success, failure: options.failure || failure, always: options.always || options.callback || always};
}

function login(options,password,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return _login((j ? j : _jar),options.username,options.password,callbacks);
  } else if (typeof options == 'string')
    return _login((jar ? jar : _jar),options,password,callbacks);
}

function getSession(options) {
  if (options && options.hasOwnProperty('jar'))
    return _getSession(options.jar);
  else
    return _getSession(options || _jar);
}

function getCurrentUser(options,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return _getCurrentUser((j ? j : _jar), options.option, callbacks);
  } else
    return _getCurrentUser((jar ? jar : _jar), options, callbacks);
}

function setRank(options,target,roleset,token,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return _setRank((j ? j : _jar), options.group, options.target, options.roleset, options.token, callbacks);
  } else
    return _setRank((jar ? jar : _jar), options, target, roleset, token, callbacks);
}

// Export
module.exports = {
  login: login,
  getSession: getSession,
  getCurrentUser: getCurrentUser,
  setRank: setRank
};

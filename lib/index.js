// Dependencies
var request = require('request');

// Includes
var login = require('./util/login.js'),
  getSession = require('./util/getSession.js'),
  getCurrentUser = require('./util/getCurrentUser.js'),
  setRank = require('./setRank.js'),
  getRoles = require('./util/getRoles.js'),
  getToken = require('./util/getToken.js'),
  getInputs = require('./util/getInputs.js'),
  message = require('./message.js'),
  shout = require('./shout.js');

// Vars
var _jar = request.jar(); // Default cookie jar

// Define
function makeCallbackArray(options,success,failure,always) {
  return {success: options.success || success, failure: options.failure || failure, always: options.always || options.callback || always};
}

exports.login = function(options,password,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return login((j ? j : _jar),options.username,options.password,callbacks);
  } else if (typeof options == 'string')
    return login((jar ? jar : _jar),options,password,callbacks);
};

exports.getSession = function(options) {
  if (options && options.hasOwnProperty('jar'))
    return getSession(options.jar);
  else
    return getSession(options || _jar);
};

exports.getCurrentUser = function(options,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return getCurrentUser((j ? j : _jar), options.option, callbacks);
  } else
    return getCurrentUser((jar ? jar : _jar), options, callbacks);
};

exports.getRoles = function(options,rank,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object')
    return getRoles(options.group, options.rank, callbacks);
  else
    return getRoles(options, rank, callbacks);
};

exports.getToken = function(options,jar,callback,failure) {
  var callbacks = {failure: options.failure || failure};
  if (typeof options == 'object') {
    var j = options.jar;
    return getToken((j ? j : _jar), options.url, callback, callbacks);
  } else
    return getToken((jar ? jar : _jar), options, callback, callbacks);
};

function setRankMain(options,target,roleset,token,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return setRank((j ? j : _jar), options.group, options.target, options.roleset, options.token, callbacks);
  } else
    return setRank((jar ? jar : _jar), options, target, roleset, token, callbacks);
}

exports.setRank = function(options) {
  if (options.rank) {
    getRoles(options.group,options.rank,{success: function(role) {
      options.roleset = role;
      setRankMain(options);
    }, failure: options.failure});
  } else
    setRankMain.apply(undefined, arguments);
};

exports.message = function(options,subject,body,token,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return message((j ? j : _jar), options.recipient, options.subject, options.body, options.token, callbacks);
  } else
    return message((jar ? jar : _jar), options, subject, body, token, callbacks);
};

exports.shout = function(options,message,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return shout((j ? j : _jar), options.group, options.message, callbacks);
  } else
    return shout((jar ? jar : _jar), options, message, callbacks);
};

exports.getJar = function() {
    return _jar;
};

exports.getInputs = function(options,find) {
  if (typeof options == 'object')
    return getInputs(options.html, options.find);
  else
    return getInputs(options,find);
};

exports.getVerificationInputs = function(options) {
  var array = ['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION'];
  if (typeof options == 'object')
    return getInputs(options.html,array);
  else
    return getInputs(options,array);
};

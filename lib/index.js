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
  getRankInGroup = require('./util/getRankInGroup.js'),
  getRolesetInGroupWithJar = require('./util/getRolesetInGroupWithJar.js'),
  exile = require('./exile.js'),
  message = require('./message.js'),
  shout = require('./shout.js'),
  post = require('./post.js');

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
    return login((j || _jar),options.username,options.password,callbacks);
  } else if (typeof options == 'string')
    return login((jar || _jar),options,password,callbacks);
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
    return getCurrentUser((j || _jar), options.option, callbacks);
  } else
    return getCurrentUser((jar || _jar), options, callbacks);
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
    return getToken((j || _jar), options.url, callback, callbacks);
  } else
    return getToken((jar || _jar), options, callback, callbacks);
};

function setRankMain(options,target,roleset,token,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return setRank((j || _jar), options.group, options.target, options.roleset, options.token, callbacks);
  } else
    return setRank((jar || _jar), options, target, roleset, token, callbacks);
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
    return message((j || _jar), options.recipient, options.subject, options.body, options.token, callbacks);
  } else
    return message((jar || _jar), options, subject, body, token, callbacks);
};

exports.shout = function(options,message,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return shout((j || _jar), options.group, options.message, callbacks);
  } else
    return shout((jar || _jar), options, message, callbacks);
};

exports.post = function(options,message,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return post((j || _jar), options.group, options.message, callbacks);
  } else
    return post((jar || _jar), options, message, callbacks);
};

exports.getRankInGroup = function(options,group,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object')
    return getRankInGroup(options.player, options.group, callbacks);
  else
    return getRankInGroup(options, group, callbacks);
};

exports.getRolesetInGroup = function(options,group,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object')
    return getRankInGroup(options.player, options.group, {success: function(rank) {
      getRoles(options.group,rank,callbacks);
    }, failure: callbacks.failure});
  else
    return getRankInGroup(options, group, {success: function(rank) {
      getRoles(group,rank,callbacks);
    }, failure: callbacks.failure});
};

exports.getRolesetInGroupWithJar = function(options,group,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (options && options.hasOwnProperty('jar')) {
    var j = options.jar;
    return getRolesetInGroupWithJar((j || _jar), options.group, callbacks);
  } else
    return getRolesetInGroupWithJar((options ? options : _jar), group, callbacks);
};

function exileMain(options,target,senderRoleSetId,deleteAllPosts,token,jar,success,failure,always) {
  var callbacks = makeCallbackArray(options,success,failure,always);
  if (typeof options == 'object') {
    var j = options.jar;
    return exile((j || _jar), options.token, options.group, options.target, options.senderRoleSetId, options.deleteAllPosts, callbacks);
  } else
    return exile((jar || _jar), token, options, target, senderRoleSetId, deleteAllPosts, callbacks);
}

exports.exile = function(options) {
  var args = Array.prototype.slice.call(arguments);
  if (options.senderRoleSetId) {
    exileMain(options);
  } else
    getRolesetInGroupWithJar(options.jar || arguments[5] || _jar,options.group || options, {success: function(roleset) {
      if (typeof options == 'object') {
        options.senderRoleSetId = roleset;
        exileMain(options);
      } else {
        args[2] = roleset;
        exileMain.apply(undefined, args);
      }
    }, failure: options.failure || arguments[7]});
};

exports.getJar = function() {
    return _jar;
};

exports.setJar = function(jar) {
  _jar = jar;
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

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
  getVerificationInputs = require('./util/getVerificationInputs.js'),
  getRankInGroup = require('./util/getRankInGroup.js'),
  getRolesetInGroupWithJar = require('./util/getRolesetInGroupWithJar.js'),
  exile = require('./exile.js'),
  message = require('./message.js'),
  handleJoinRequest = require('./handleJoinRequest.js').handle,
  getRequestId = require('./handleJoinRequest.js').request,
  getUserId = require('./util/getUserId.js'),
  shout = require('./shout.js'),
  post = require('./post.js');

var cache = require('./cache/index.js');

var settings = require('../settings.json');

// Vars
var _jar = request.jar(); // Default cookie jar
var _cache = cache.new([{
  name: 'XCSRF',
  expire: settings.cache.XCSRF
}, {
  name: 'Roles',
  expire: settings.cache.Roles
}]);

// Define
function makeCallbackArray(options, success, failure, always) {
  return {success: options.success || success, failure: options.failure || failure, always: options.always || options.callback || always};
}

exports.login = function(options, password, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  login(options.jar || jar || _jar, options.username || options, options.password || password, callbacks);
};

exports.getSession = function(options) {
  getSession(options.jar || options || _jar);
};

exports.getCurrentUser = function(options, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getCurrentUser(options.jar || jar || _jar, options.option || typeof options === 'string' && options, callbacks);
};

exports.getRoles = function(options, rank, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getRoles(options.group || options, options.rank || rank, callbacks);
};

exports.getToken = function(options, jar, callback, failure) {
  var callbacks = {failure: options.failure || failure};
  getToken(options.jar || jar || _jar, options.url || options, callback, callbacks);
};

function setRankMain(options, target, roleset, token, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  jar = options.jar || jar || _jar;
  var url = 'http://www.roblox.com/groups/api/change-member-rank?groupId=' + options.group || options + '&newRoleSetId=' + options.roleset || roleset + '&targetUserId=' + options.target || target;
  var run = function(token) {
    setRank(jar, url, token, callbacks);
  };
  if (token)
    run(token);
  else {
    cache.addIf(_cache, 'XCSRF', 'setRank', {
      done: run,
      add: function(done) {
        getToken(jar, url, done, callbacks);
      }
    });
  }
}

exports.setRank = function(options) {
  if (options.rank) {
    getRoles(options.group, options.rank, {success: function(role) {
      options.roleset = role;
      setRankMain(options);
    }, failure: options.failure});
  } else
    setRankMain.apply(undefined, arguments);
};

exports.message = function(options, subject, body, token, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  jar = options.jar || jar || _jar;
  var run = function(token) {
    message(jar, options.recipient || options, options.subject || subject, options.body || body, token, callbacks);
  };
  if (token)
    run(token);
  else {
    cache.addIf(_cache, 'XCSRF', 'message', {
      done: run,
      add: function(done) {
        getToken(jar, 'http://www.roblox.com/messages/send', done, callbacks);
      }
    });
  }
};

exports.shout = function(options, message, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  shout(options.jar || jar || _jar, options.group || options, options.message || message, callbacks);
};

exports.handleJoinRequest = function(options, username, accept, jar, token, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  jar = options.jar || jar || _jar;
  var form = {
    groupJoinRequestId: 0,
    accept: options.accept || accept
  };
  var run = function(token) {
    handleJoinRequest(jar, token, form, callbacks);
  };
  cache.addIf(_cache, 'XCSRF', 'handleJoinRequest', {
    done: run,
    add: function(done) {
      getRequestId(jar, options.group || options, options.username || username, function(id) {
        form.groupJoinRequestId = id;
        getToken(jar, 'http://www.roblox.com/group/handle-join-request', done, callbacks, form);
      }, callbacks);
    }
  });
};

exports.post = function(options, message, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  post(options.jar || jar || _jar, options.group, options.message, callbacks);
};

exports.getRankInGroup = function(options, group, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getRankInGroup(options.player || options, options.group || group, callbacks);
};

exports.getRolesetInGroup = function(options, group, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getRankInGroup(options.player || options, options.group || group, {success: function(rank) {
    getRoles(options.group, rank, callbacks);
  }, failure: callbacks.failure});
};

exports.getRolesetInGroupWithJar = function(options, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getRolesetInGroupWithJar(options.jar || jar || _jar, options.group || options, callbacks);
};


function exileMain(options, json, token, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  var run = function(token) {
    exile(options.jar || jar || _jar, token, json, callbacks);
  };
  if (options.token || token)
    run(options.token || token);
  else {
    cache.addIf(_cache, 'XCSRF', 'exile', {
      done: run,
      add: function(done) {
        getToken(jar, 'http://www.roblox.com/My/Groups.aspx/ExileUserAndDeletePosts', done, callbacks, undefined, json);
      }
    });
  }
}

exports.exile = function(options, target, senderRoleSetId, deleteAllPosts, token, jar, success, failure, always) {
  jar = options.jar || jar || _jar;
  var json = {
    userId: options.target || target,
    deleteAllPostsOption: options.deleteAllPosts || deleteAllPosts || false,
    rolesetId: options.senderRoleSetId || senderRoleSetId,
    selectedGroupId: options.group || options
  };
  if (!options.senderRoleSetId && !senderRoleSetId) {
    var opt = {
      group: options.group || options,
      jar: jar,
      success: function(roleset) {
        json.rolesetId = roleset;
        exileMain(options, json, token, jar, success, failure, always);
      },
      failure: options.failure || failure
    };
    exports.getRolesetInGroupWithJar(opt);
  } else
    exileMain(options, json, token, jar, success, failure, always);
};

exports.getJar = function() {
  return _jar;
};

exports.setJar = function(jar) {
  _jar = jar;
};

exports.getUserId = function(jar) {
  return getUserId(jar);
};

exports.getInputs = function(options, find) {
  return getInputs(options.html || options, options.find || find);
};

exports.getVerificationInputs = function(options) {
  return getVerificationInputs(options.html || options, array);
};

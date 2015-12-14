// Dependencies
var request = require('request');

// Includes
var login = require('./util/login.js'),
  getSession = require('./util/getSession.js'),
  getCurrentUser = require('./util/getCurrentUser.js'),
  setRank = require('./setRank.js'),
  getRoles = require('./util/getRoles.js'),
  getRole = require('./util/getRole.js'),
  getToken = require('./util/getToken.js'),
  getVerification = require('./util/getVerification.js'),
  getInputs = require('./util/getInputs.js'),
  getProductInfo = require('./util/getProductInfo.js'),
  getVerificationInputs = require('./util/getVerificationInputs.js'),
  getRankInGroup = require('./util/getRankInGroup.js'),
  getRolesetInGroupWithJar = require('./util/getRolesetInGroupWithJar.js'),
  getIdFromUsername = require('./util/getIdFromUsername.js'),
  getUsernameFromId = require('./util/getUsernameFromId.js'),
  exile = require('./exile.js'),
  message = require('./message.js'),
  buy = require('./buy.js'),
  upload = require('./upload.js'),
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
  refresh: settings.cache.xcsrf_refresh,
  expire: settings.cache.XCSRF
}, {
  name: 'Verify',
  refresh: settings.cache.verify_refresh,
  expire: settings.cache.Veirfy
}, {
  name: 'Roles',
  refresh: settings.cache.xcsrf_refresh,
  expire: settings.cache.Roles
}, {
  name: 'Product',
  refresh: settings.cache.xcsrf_refresh,
  expire: settings.cache.Product
}]);
var _handler = function(err, id) {
  console.error('Error from ' + id + ': ' + err);
};

// Define
function makeCallbackArray(options, success, failure, always) {
  return {success: options.success || success, failure: options.failure || failure || _handler, always: options.always || options.callback || always};
}

exports.login = function(options, password, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  login(options.jar || jar || _jar, options.username || options, options.password || password, callbacks);
};

exports.getSession = function(options) {
  return getSession(options.jar || options || _jar);
};

exports.getCurrentUser = function(options, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getCurrentUser(options.jar || jar || _jar, options.option || typeof options === 'string' && options, callbacks);
};

exports.getRoles = function(options, rank, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  var group = options.group || options;
  rank = options.rank || rank;
  success = function(roles) {
    var response = roles;
    if (rank)
      response = getRole(roles, rank);
    callbacks.success(response);
  };
  cache.addIf(_cache, 'Roles', group, {
    done: success,
    add: function(done) {
      getRoles(group || options, {success: function(roles) {
        done(roles);
      }, failure: callbacks.failure});
    }
  });
};

exports.upload = function(options, itemOptions, asset, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  upload(options.jar || jar || _jar, options.data || options, options.itemOptions || itemOptions, options.asset || asset, callbacks);
};

exports.getToken = function(options, jar, callback, failure) {
  var callbacks = {failure: options.failure || failure};
  getToken(options.jar || jar || _jar, options.url || options, callback, callbacks);
};

exports.getVerification = function(options, jar, callback, failure) {
  var callbacks = {failure: options.failure || failure};
  getVerification(options.jar || jar || _jar, options.url || options, callback, callbacks);
};

exports.getProductInfo = function(options, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  var asset = options.asset || options;
  cache.addIf(_cache, 'Product', asset, {
    done: callbacks.success,
    add: function(done) {
      getProductInfo(asset, {success: function(info) {
        done(info);
      }, failure: callbacks.failure, always: callbacks.always});
    }
  });
};

function buyMain(jar, asset, currency, info, callbacks) {
  var url = 'http://www.roblox.com/API/Item.ashx?rqtype=purchase&productID='+ info.ProductId + '&expectedCurrency=' + currency + '&expectedPrice=' + ((currency === 1 ? info.PriceInRobux : info.PriceInTickets) || 0) + '&expectedSellerID=' + info.Creator.Id;
  cache.addIf(_cache, 'XCSRF', 'buy', {
    done: function(token) {
      buy(jar, token, url, callbacks);
    },
    add: function(done) {
      getToken(jar, url, done, callbacks);
    }
  });
}

exports.buy = function(options, currency, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  var asset = options.asset || options;
  currency = options.currency || currency;
  currency = (currency == 'robux' ? 1 : 2);
  var opt = {
    asset: asset,
    success: function(info) {
      buyMain(options.jar || jar || _jar, asset, currency, info, callbacks);
    },
    failure: callbacks.failure,
    always: callbacks.always
  };
  exports.getProductInfo(opt);
};

function setRankMain(options, target, roleset, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  jar = options.jar || jar || _jar;
  var url = 'http://www.roblox.com/groups/api/change-member-rank?groupId=' + (options.group || options) + '&newRoleSetId=' + (options.roleset || roleset) + '&targetUserId=' + (options.target || target);
  cache.addIf(_cache, 'XCSRF', 'setRank', {
    done: function(token) {
      setRank(jar, url, token, callbacks);
    },
    add: function(done) {
      getToken(jar, url, done, callbacks);
    }
  });
}

exports.setRank = function(options) {
  if (options.rank) {
    exports.getRoles(options.group, options.rank, function(role) {
      options.roleset = role;
      setRankMain(options);
    }, options.failure);
  } else
    setRankMain.apply(undefined, arguments);
};

exports.message = function(options, subject, body, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  jar = options.jar || jar || _jar;
  cache.addIf(_cache, 'XCSRF', 'message', {
    done: function(token) {
      message(jar, options.recipient || options, options.subject || subject, options.body || body, token, callbacks);
    },
    add: function(done) {
      getToken(jar, 'http://www.roblox.com/messages/send', done, callbacks);
    }
  });
};

exports.shout = function(options, message, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  var group = options.group || options;
  jar = options.jar || jar || _jar;
  cache.addIf(_cache, 'Verify', 'shout', {
    done: function(verification) {
      shout(jar, verification, group, options.message || message, callbacks);
    },
    add: function(done) {
      getVerification(jar, 'http://www.roblox.com/My/Groups.aspx?gid=' + group, done, callbacks);
    }
  });
};

exports.post = function(options, message, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  var group = options.group || options;
  jar = options.jar || jar || _jar;
  cache.addIf(_cache, 'Verify', 'post', {
    done: function(verification) {
      post(jar, verification, group, options.message || message, callbacks);
    },
    add: function(done) {
      getVerification(jar, 'http://www.roblox.com/My/Groups.aspx?gid=' + group, done, callbacks);
    }
  });
};

exports.handleJoinRequest = function(options, username, accept, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  jar = options.jar || jar || _jar;
  var form = {
    groupJoinRequestId: 0,
    accept: options.accept || accept
  };
  cache.addIf(_cache, 'XCSRF', 'handleJoinRequest', {
    done: function(token) {
      handleJoinRequest(jar, token, form, callbacks);
    },
    add: function(done) {
      getRequestId(jar, options.group || options, options.username || username, function(id) {
        form.groupJoinRequestId = id;
        getToken(jar, 'http://www.roblox.com/group/handle-join-request', done, callbacks, form);
      }, callbacks);
    }
  });
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


function exileMain(options, json, jar, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  cache.addIf(_cache, 'XCSRF', 'exile', {
    done: function(token) {
      exile(options.jar || jar || _jar, token, json, callbacks);
    },
    add: function(done) {
      getToken(jar, 'http://www.roblox.com/My/Groups.aspx/ExileUserAndDeletePosts', done, callbacks, undefined, json);
    }
  });
}

exports.exile = function(options, target, senderRoleSetId, deleteAllPosts, jar, success, failure, always) {
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
        exileMain(options, json, jar, success, failure, always);
      },
      failure: options.failure || failure
    };
    exports.getRolesetInGroupWithJar(opt);
  } else
    exileMain(options, json, jar, success, failure, always);
};

exports.getUsernameFromId = function(options, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getUsernameFromId(options, callbacks);
};

exports.getIdFromUsername = function(options, success, failure, always) {
  var callbacks = makeCallbackArray(options, success, failure, always);
  getIdFromUsername(options, callbacks);
};

exports.getJar = function() {
  return _jar;
};

exports.setJar = function(jar) {
  _jar = jar;
};

exports.setFailureHandler = function(handler) {
  _handler = handler;
};

exports.getFailureHandler = function(handler) {
  return _handler;
};

exports.getUserId = function(jar) {
  return getUserId(jar);
};

exports.getInputs = function(options, find) {
  return getInputs(options.html || options, options.find || find);
};

exports.getVerificationInputs = function(options) {
  return getVerificationInputs(options.html || options);
};

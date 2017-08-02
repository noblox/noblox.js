// Includes
var http = require('./http.js').func;
var getGeneralToken = require('./getGeneralToken.js').func;
var getSenderUserId = require('./getSenderUserId.js').func;

// Args
exports.required = ['userId'];
exports.optional = ['jar'];

// Define
function acceptFriendReqest (jar, token, userId, senderUserId) {
  var httpOpt = {
    url: '//www.roblox.com/api/friends/acceptfriendrequest',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        targetUserID: userId,
        invitationID: senderUserId
      },
      resolveWithFullResponse: true
    }
  };
  return http(httpOpt)
  .then(function (res) {
    if (res.statusCode === 200) {
      var body = res.body;
      if (!body.success) {
        throw new Error(body.message);
      }
    } else {
      throw new Error('Accept friend request failed');
    }
  });
}

exports.func = function (args, senderUserId) {
  var jar = args.jar;
  return getSenderUserId({jar: jar})
  .then(function (senderUserId) {
    return getGeneralToken({jar: jar})
    .then(function (xcsrf) {
      return acceptFriendReqest(jar, xcsrf, args.userId, senderUserId);
    });
  });
};

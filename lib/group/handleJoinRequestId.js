// Includes
var http = require('./http.js').func;
var getGeneralToken = require('./getGeneralToken.js').func;

// Args
exports.required = ['group', 'requestId', 'accept'];
exports.optional = ['jar'];

// Define
function handleJoinRequestId (jar, token, accept, requestId) {
  var httpOpt = {
    url: '//www.roblox.com/group/handle-join-request',
    options: {
      method: 'POST',
      jar: jar,
      form: {
        groupJoinRequestId: requestId,
        accept: accept
      },
      headers: {
        'X-CSRF-TOKEN': token
      }
    }
  };
  return http(httpOpt)
  .then(function (body) {
    if (!JSON.parse(body).success) {
      throw new Error('Invalid permissions, make sure the user is in the group and is allowed to handle join requests');
    }
  });
}

exports.func = function (args) {
  var jar = args.jar;
  var requestId = args.requestId;
  return getGeneralToken({jar: jar})
  .then(function (xcsrf) {
    return handleJoinRequestId(jar, xcsrf, args.accept, requestId);
  });
};

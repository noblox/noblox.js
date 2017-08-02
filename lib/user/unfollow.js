// Includes
var http = require('../util/http.js').func;
var getGeneralToken = require('../util/getGeneralToken.js').func;

// Args
exports.required = ['userId'];
exports.optional = ['jar'];

// Define
function unfollow (jar, token, userId) {
  var httpOpt = {
    url: '//www.roblox.com/api/user/unfollow',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        targetUserId: userId
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
      throw new Error('Unfollow failed');
    }
  });
}

exports.func = function (args) {
  var jar = args.jar;
  return getGeneralToken({jar: jar})
  .then(function (xcsrf) {
    return unfollow(jar, xcsrf, args.userId);
  });
};

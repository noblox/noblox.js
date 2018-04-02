// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Define
function sendFriendRequest (jar, token, userId) {
  var httpOpt = {
    url: '//www.roblox.com/api/friends/sendfriendrequest',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        targetUserID: userId
      },
      resolveWithFullResponse: true
    }
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var body = res.body
        if (!body.success) {
          throw new Error(body.message)
        }
      } else {
        throw new Error('Send friend request failed')
      }
    })
}

exports.func = function (args) {
  var jar = args.jar
  return getGeneralToken({jar: jar})
    .then(function (xcsrf) {
      return sendFriendRequest(jar, xcsrf, args.userId)
    })
}

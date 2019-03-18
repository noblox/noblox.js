// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Define
function follow (jar, token, userId) {
  var httpOpt = {
    url: '//www.roblox.com/user/follow',
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
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        var body = res.body
        if (!body.success) {
          throw new Error(body.message)
        }
      } else {
        throw new Error('Follow failed')
      }
    })
}

exports.func = function (args) {
  var jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return follow(jar, xcsrf, args.userId)
    })
}

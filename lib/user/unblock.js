// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Define
function unblock (jar, token, userId) {
  var httpOpt = {
    url: '//www.roblox.com/userblock/unblockuser',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        blockeeId: userId
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
        throw new Error('Unblock failed')
      }
    })
}

exports.func = function (args) {
  var jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return unblock(jar, xcsrf, args.userId)
    })
}

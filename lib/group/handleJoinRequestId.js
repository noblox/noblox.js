// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'requestId', 'accept']
exports.optional = ['jar']

// Define
function handleJoinRequestId (jar, token, accept, requestId) {
  var httpOpt = {
    url: '//www.roblox.com/group/handle-join-request',
    options: {
      method: 'POST',
      jar: jar,
      form: {
        groupJoinRequestId: requestId
      },
      headers: {
        'X-CSRF-TOKEN': token
      },
      resolveWithFullResponse: true
    }
  }
  if (!accept) {
    httpOpt.options.form.accept = false
  }
  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 200) {
        if (!JSON.parse(res.body).success) {
          throw new Error('Invalid permissions, make sure the user is in the group and is allowed to handle join requests')
        }
      } else {
        throw new Error('Invalid status: ' + res.statusCode + ' ' + res.statusMessage)
      }
    })
}

exports.func = function (args) {
  var jar = args.jar
  var requestId = args.requestId
  return getGeneralToken({jar: jar})
    .then(function (xcsrf) {
      return handleJoinRequestId(jar, xcsrf, args.accept, requestId)
    })
}

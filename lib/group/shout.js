// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group']
exports.optional = ['message', 'jar']

function shoutOnGroup (group, shoutMessage, jar, xcsrf) {
  var httpOpt = {
    url: `https://groups.roblox.com/v1/groups/${group}/status`,
    options: {
      method: 'PATCH',
      resolveWithFullResponse: true,
      json: {
        message: shoutMessage
      },
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': xcsrf
      }
    }
  }

  return http(httpOpt)
    .then(function (res) {
      if (res.statusCode === 403) {
        throw new Error('Token Validation Failed - Failed to verify XCSRF Token.')
      }
      if (res.statusCode === 401) {
        throw new Error('Shout failed, verify that you are logged in.')
      }
      if (res.statusCode === 400) {
        let resErrors = res.body.errors
        for (let i = 0; i < resErrors.length; i++) {
          let resError = resErrors[i]
          if (resError.code === 7) {
            throw new Error('Shout failed, verify that you are providing a message to shout.')
          }
          if (resError.code === 6) {
            throw new Error('Shout failed, verify that the logged in user has permissions to shout.')
          }
          if (resError.code === 1) {
            throw new Error('Shout failed, verify that the group provided exists.')
          }
        }
      }
    })
}

// Define
exports.func = function (args) {
  let jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return shoutOnGroup(args.group, args.message, args.jar, xcsrf)
    })
}

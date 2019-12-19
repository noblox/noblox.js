// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'userId', 'accept']
exports.optional = ['jar']

function handleJoinRequest (group, userId, accept, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/join-requests/users/${userId}`,
      options: {
        method: accept ? 'POST' : 'DELETE',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        let responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve()
        }
      })
  })
}

// Define
exports.func = function (args) {
  let jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return handleJoinRequest(args.group, args.userId, args.accept, args.jar, xcsrf)
    })
}

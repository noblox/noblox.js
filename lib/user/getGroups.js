// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Define
function getGroups (jar, token, userId) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `//api.roblox.com/users/${userId}/groups`,
      options: {
        method: 'GET',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.body))
        } else {
          const body = JSON.parse(res.body) || {}
          if (body.errors && body.errors.length > 0) {
            var errors = body.errors.map((e) => {
              return e.message
            })
            reject(new Error(`${res.statusCode} ${errors.join(', ')}`))
          }
        }
      })
  })
}

exports.func = function (args, senderUserId) {
  var jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return getGroups(jar, xcsrf, args.userId)
    })
}

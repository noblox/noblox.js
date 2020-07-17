// Includes
var http = require('../util/http.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Define
function getGroups (jar, userId) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `//api.roblox.com/users/${userId}/groups`,
      options: {
        method: 'GET',
        jar: jar,
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
  return getGroups(jar, args.userId)
}

// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group']
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

// Define
function getJoinRequests (jar, token, group, sortOrder, limit, cursor) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `//groups.roblox.com/v1/groups/${group}/join-requests?limit=${limit}&sortOrder=${sortOrder}&cursor=${cursor}`,
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

exports.func = function (args) {
  const jar = args.jar
  const sortOrder = args.sortOrder || 'Asc'
  const limit = args.limit || (10).toString()
  const cursor = args.cursor || ''
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return getJoinRequests(jar, xcsrf, args.group, sortOrder, limit, cursor)
    })
}

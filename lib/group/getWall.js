var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['group']
exports.optional = ['sortOrder', 'limit', 'cursor', 'jar']

function getPosts (group, sortOrder, limit, cursor, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://groups.roblox.com/v2/groups/${group}/wall/posts?limit=${limit}&sortOrder=${sortOrder}&cursor=${cursor}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': xcsrf
        }
      }
    }

    return http(httpOpt)
      .then(function (res) {
        const responseData = JSON.parse(res.body)
        if (res.statusCode !== 200) {
          let error = 'An unknown error has occurred.'
          if (responseData && responseData.errors) {
            error = responseData.errors.map((e) => e.message).join('\n')
          }
          reject(new Error(error))
        } else {
          resolve(responseData)
        }
      })
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  const sortOrder = args.sortOrder || 'Asc'
  const limit = args.limit || 100
  const cursor = args.cursor || ''
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return getPosts(args.group, sortOrder, limit, cursor, args.jar, xcsrf)
    })
}

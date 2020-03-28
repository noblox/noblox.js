// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['group', 'message']
exports.optional = ['jar']

function postOnGroup (group, postMessage, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://groups.roblox.com/v2/groups/${group}/wall/posts`,
      options: {
        method: 'POST',
        resolveWithFullResponse: true,
        json: {
          body: postMessage
        },
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
          resolve()
        }
      })
  })
}

// Define
exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return postOnGroup(args.group, args.message, args.jar, xcsrf)
    })
}

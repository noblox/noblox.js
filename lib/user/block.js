// Includes
const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = ['userId']
exports.optional = ['jar']

// Define
function block (jar, token, userId) {
  const httpOpt = {
    url: '//www.roblox.com/userblock/blockuser',
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
        const body = res.body
        if (!body.success) {
          throw new Error(body.message)
        }
      } else {
        throw new Error('Block failed')
      }
    })
}

exports.func = function (args) {
  const jar = args.jar
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return block(jar, xcsrf, args.userId)
    })
}

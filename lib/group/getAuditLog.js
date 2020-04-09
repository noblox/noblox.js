// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['group']
exports.optional = ['actionType', 'userId', 'sortOrder', 'limit', 'cursor', 'jar']

function getAuditLog (group, actionType, userId, sortOrder, limit, cursor, jar, xcsrf) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/audit-log?actionType=${actionType}&cursor=${cursor}&limit=${limit}&sortOrder=${sortOrder}&userId=${userId}`,
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
  const actionType = args.actionType || ''
  const userId = args.userId || ''
  const sortOrder = args.sortOrder || 'Asc'
  const limit = args.limit || (100).toString()
  const cursor = args.cursor || ''
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return getAuditLog(args.group, actionType, userId, sortOrder, limit, cursor, jar, xcsrf)
    })
}

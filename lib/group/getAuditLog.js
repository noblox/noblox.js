// Includes
const http = require('../util/http.js').func
const Promise = require('bluebird')

exports.required = ['group']
exports.optional = ['actionType', 'userId', 'sortOrder', 'limit', 'cursor', 'jar']

function getAuditLog (group, actionType, userId, sortOrder, limit, cursor, jar) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `https://groups.roblox.com/v1/groups/${group}/audit-log?actionType=${actionType}&cursor=${cursor}&limit=${limit}&sortOrder=${sortOrder}&userId=${userId}`,
      options: {
        method: 'GET',
        resolveWithFullResponse: true,
        jar: jar
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
  return getAuditLog(args.group, actionType, userId, sortOrder, limit, cursor, jar)
}

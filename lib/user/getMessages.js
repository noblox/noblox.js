// Includes
var http = require('../util/http.js').func
var getGeneralToken = require('../util/getGeneralToken.js').func

// Args
exports.required = []
exports.optional = ['pageNumber', 'pageSize', 'messageTab', 'jar']

// Define
function getMessages (jar, token, pageNumber, pageSize, messageTab) {
  return new Promise((resolve, reject) => {
    var httpOpt = {
      url: `//privatemessages.roblox.com/v1/messages?pageNumber=${pageNumber}&pageSize=${pageSize}&messageTab=${messageTab}`,
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
  const pageNumber = (args.pageNumber && args.pageNumber.toString()) || '0'
  const pageSize = (args.pageSize && args.pageSize.toString()) || '25'
  const messageTab = args.messageTab || 'Inbox'
  if (!['Inbox', 'Sent', 'Archive'].includes(messageTab)) {
    return new Promise((resolve, reject) => {
      reject(new Error('messageTab must be Inbox, Sent, or Archive'))
    })
  }
  return getGeneralToken({ jar: jar })
    .then(function (xcsrf) {
      return getMessages(jar, xcsrf, pageNumber, pageSize, messageTab)
    })
}

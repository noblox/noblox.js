<<<<<<< HEAD
let http = require('../util/http.js').func
=======
const http = require('../util/http.js').func
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

exports.required = ['conversationId']
exports.optional = ['pageSize', 'exclusiveStartMessageId', 'jar']

exports.func = (args) => {
<<<<<<< HEAD
    let jar = args.jar,
        conversationId = parseInt(args.conversationId) ? parseInt(args.conversationId) : 0,
        pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 100,
        startMessageId = typeof(args.exclusiveStartMessageId) === 'string' ? args.exclusiveStartMessageId : ''
    
    return http({
        url: '//chat.roblox.com/v2/get-messages?conversationId=' + conversationId + '&pageSize=' + pageSize + '&exclusiveStartMessageId=' + startMessageId,
        options: {
            method: 'GET',
            jar: jar,
            resolveWithFullResponse: true
        }
    }).then((res) => {
        if (res.statusCode !== 200) {
            throw new Error('You are not logged in')
        } else {
            return JSON.parse(res.body)
        }
    })
}
=======
  const jar = args.jar
  let conversationId = parseInt(args.conversationId) ? parseInt(args.conversationId) : 0
  let pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 100
  let startMessageId = typeof (args.exclusiveStartMessageId) === 'string' ? args.exclusiveStartMessageId : ''

  return http({
    url: '//chat.roblox.com/v2/get-messages?conversationId=' + conversationId + '&pageSize=' + pageSize + '&exclusiveStartMessageId=' + startMessageId,
    options: {
      method: 'GET',
      jar: jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error('You are not logged in')
    } else {
      return JSON.parse(res.body)
    }
  })
}
>>>>>>> 830c1d46b5caeb107f1ee1f1af0d051a66655226

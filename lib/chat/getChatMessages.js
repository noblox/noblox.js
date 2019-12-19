const http = require('../util/http.js').func

exports.required = ['conversationId']
exports.optional = ['pageSize', 'exclusiveStartMessageId', 'jar']

exports.func = (args) => {
  const jar = args.jar
  const conversationId = parseInt(args.conversationId) ? parseInt(args.conversationId) : 0
  const pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 100
  const startMessageId = typeof (args.exclusiveStartMessageId) === 'string' ? args.exclusiveStartMessageId : ''

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

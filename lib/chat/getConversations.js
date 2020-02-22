const http = require('../util/http.js').func

exports.required = ['conversationIds']
exports.optional = ['jar']

exports.func = (args) => {
  const jar = args.jar
  const conversationIds = typeof (args.conversationIds) === 'object' ? args.conversationIds : []

  return http({
    url: '//chat.roblox.com/v2/get-conversations?conversationIds=' + conversationIds.join('&conversationIds='),
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

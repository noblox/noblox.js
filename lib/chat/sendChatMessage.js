const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['conversationId', 'message']
exports.optional = ['jar']

const sendChat = (jar, token, conversationId, messageText) => {
  return http({
    url: '//chat.roblox.com/v2/send-message',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        conversationId: conversationId,
        message: messageText
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Send chat message failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return sendChat(jar, xcsrf, args.conversationId, args.message)
  })
}

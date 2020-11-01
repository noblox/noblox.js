const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['conversationId', 'isTyping']
exports.optional = ['jar']

// Docs
/**
 * Trigger the typing action in a conversation.
 * @category Chat
 * @alias setChatUserTyping
 * @param {number} conversationId - The id of the conversation.
 * @param {boolean} isTyping - If the user is typing.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.setChatUserTyping(1, true)
**/

const nextFunction = (jar, token, conversationId, isTyping) => {
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
        isTyping: isTyping
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Set typing status failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.conversationId, args.isTyping)
  })
}

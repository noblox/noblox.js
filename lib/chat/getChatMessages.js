const http = require('../util/http.js').func

exports.required = ['conversationId']
exports.optional = ['pageSize', 'exclusiveStartMessageId', 'jar']

// Docs
/**
 * 🔐 Get the chat messages for a conversation.
 * @category Chat
 * @alias getChatMessages
 * @param {number} conversationId - The id of the conversation.
 * @param {number=} [pageSize=100] - The size of the page.
 * @param {string=} exclusiveStartMessageId - The messageId to start at.
 * @returns {Promise<ChatMessage[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const messages = await noblox.getChatMessages(1, 25)
**/

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

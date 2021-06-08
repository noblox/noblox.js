const http = require('../util/http.js').func

exports.required = ['conversationIds']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Add users to a conversation.
 * @category Chat
 * @alias getConversations
 * @param {Array} conversationIds - An array with the ids of the conversations.
 * @returns {Promise<ChatConversation[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const conversations = await noblox.getConversations([1, 2, 3])
**/

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

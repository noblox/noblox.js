const http = require('../util/http.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationIds']
exports.optional = ['pageSize', 'jar']

// Docs
/**
 * 🔐 Returns unread messages in the given conversations
 * @category Chat
 * @alias getUnreadMessages
 * @param {Array<number>} conversationIds - The IDs of the conversations you want unread messages from.
 * @param {number} pageSize - Number of messages to return on each page.
 * @returns {Promise<ChatConversationWithMessages[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.getUnreadMessages([8212952828])
**/

exports.func = (args) => {
  const jar = args.jar
  const conversationIds = typeof (args.conversationIds) === 'object' ? args.conversationIds : []
  const pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30

  return http({
    url: '//chat.roblox.com/v2/get-unread-messages?pageSize=' + pageSize + '&conversationIds=' + conversationIds.join('&conversationIds='),
    options: {
      method: 'GET',
      jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new RobloxAPIError(res)
    } else {
      return JSON.parse(res.body)
    }
  })
}

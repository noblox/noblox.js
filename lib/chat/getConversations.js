const http = require('../util/http.js').func

exports.required = ['conversationIds']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Get conversation details for the conversationIds specified in the parameters
 * @category Chat
 * @alias getConversations
 * @param {Array<number>} conversationIds - An array with the ids of the conversations.
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
      jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode !== 200) {
      throw new Error('You are not logged in')
    } else {
      let response = JSON.parse(res.body)

      response = response.map((entry) => {
        entry.lastUpdated = new Date(entry.lastUpdated)
        return entry
      })

      return response
    }
  })
}

const http = require('../util/http.js').func

exports.required = ['conversationIds']
exports.optional = ['pageSize', 'jar']

// Docs
/**
 * Add users to a conversation.
 * @category Chat
 * @alias getUnreadMessages
 * @param {number} conversationId - The id of the conversation.
 * @param {string} name - The new name of the asset.
 * @param {string} description - The new description of the asset.
 * @param {boolean=} enableComments - Enable comments on your asset.
 * @param {number|boolean=} sellforRobux - The amount of robux to sell for / enable copying
 * @param {string=} [genreSelection=All] - The genre of your asset.
 * @returns {Promise<ChatConversationWithMessages[]>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.configureItem(1117747196, "Item", "A cool item.")
**/

exports.func = (args) => {
  const jar = args.jar
  const conversationIds = typeof (args.conversationIds) === 'object' ? args.conversationIds : []
  const pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30

  return http({
    url: '//chat.roblox.com/v2/get-unread-messages?pageSize=' + pageSize + '&conversationIds=' + conversationIds.join('&conversationIds='),
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

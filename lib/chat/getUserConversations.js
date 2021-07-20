const http = require('../util/http.js').func

exports.optional = ['pageNumber', 'pageSize', 'jar']

// Docs
/**
 * 🔐 Get your conversations.
 * @category Chat
 * @alias getUserConversations
 * @param {number=} pageNumber - The page index.
 * @param {number=} pageSize - The size of each page.
 * @returns {Promise<ChatConversation[]>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const conversations = await noblox.getUserConversations()
**/

exports.func = (args) => {
  const jar = args.jar
  const pageNumber = parseInt(args.pageNumber) ? parseInt(args.pageNumber) : 1
  const pageSize = parseInt(args.pageSize) ? parseInt(args.pageSize) : 30

  return http({
    url: '//chat.roblox.com/v2/get-user-conversations?pageNumber=' + pageNumber + '&pageSize=' + pageSize,
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

const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationIds']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Mark chats as seen.
 * @category Chat
 * @alias markChatAsSeen
 * @param {Array<number>} conversationIds - An array with conversationIds.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.markChatAsSeen([1, 2, 3])
**/

const nextFunction = (jar, token, conversationIds) => {
  return http({
    url: '//chat.roblox.com/v2/mark-as-seen',
    options: {
      method: 'POST',
      jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        conversationsToMarkSeen: conversationIds
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new RobloxAPIError(res)
      }
    } else {
      throw new RobloxAPIError(res)
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.conversationIds)
  })
}

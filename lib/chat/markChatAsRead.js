const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationId', 'endMessageId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Mark a chat as read.
 * @category Chat
 * @alias markChatAsRead
 * @param {number} conversationId - The id of the conversation.
 * @param {string} endMessageId - The last message to read.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.markChatAsRead(8212952828, 'e775e103-876f-4332-84ab-1ea14f326d39')
**/

const nextFunction = (jar, token, conversationId, endMessageId) => {
  return http({
    url: '//chat.roblox.com/v2/mark-as-read',
    options: {
      method: 'POST',
      jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        conversationId,
        endMessageId
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
    return nextFunction(jar, xcsrf, args.conversationId, args.endMessageId)
  })
}

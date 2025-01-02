const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationId', 'message']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Send a message in a chat.
 * @category Chat
 * @alias sendChatMessage
 * @param {number} conversationId - The id of the conversation.
 * @param {string} message - The message to send.
 * @returns {Promise<SendChatResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.sendChatMessage(1, "Hello world!")
**/

function sendChatMessage (conversationId, messageText, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/send-message',
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          conversationId,
          message: messageText
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt).then((res) => {
      if (res.statusCode === 200) {
        if (!res.body.resultType === 'Success') {
          reject(new RobloxAPIError(res))
        } else {
          resolve(res.body)
        }
      } else {
        reject(new RobloxAPIError(res))
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar }).then((xcsrf) => {
    return sendChatMessage(args.conversationId, args.message, jar, xcsrf)
  })
}

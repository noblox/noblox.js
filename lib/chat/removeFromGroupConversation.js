const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['conversationId', 'userId']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Remove a user from the group conversation.
 * @category Chat
 * @alias removeFromGroupConversation
 * @param {number} conversationId - The id of the conversation.
 * @param {number} userId - The id of the user.
 * @returns {Promise<ConversationRemoveResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.removeFromGroupConversation(1, 2)
**/

function removeFromGroupConversation (conversationId, userId, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/remove-from-conversation',
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          conversationId: conversationId,
          participantUserId: userId
        },
        resolveWithFullResponse: true
      }
    }

    return http(httpOpt).then((res) => {
      if (res.statusCode === 200) {
        if (!res.body.resultType === 'Success') {
          reject(new Error(res.body.statusMessage))
        } else {
          resolve(res.body)
        }
      } else {
        let error = 'An unknown error has occurred.'
        if (res.body && res.body.errors) {
          error = res.body.errors.map((e) => e.message).join('\n')
        }
        reject(new Error(error))
      }
    })
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return removeFromGroupConversation(args.conversationId, args.userId, jar, xcsrf)
  })
}

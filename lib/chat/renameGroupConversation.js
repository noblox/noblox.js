const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['conversationId', 'title']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Rename a group conversation.
 * @category Chat
 * @alias renameGroupConversation
 * @param {number} conversationId - The id of the conversation.
 * @param {string} title - The new title of the group.
 * @returns {Promise<ConversationRenameResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.renameGroupConversation(1, "A cool group.")
**/

function renameGroupConversation (conversationId, newTitle, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/rename-group-conversation',
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          conversationId,
          newTitle
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
    return renameGroupConversation(args.conversationId, args.title, jar, xcsrf)
  })
}

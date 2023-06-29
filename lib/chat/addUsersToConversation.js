const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['conversationId', 'userIds']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Add users to a conversation.
 * @category Chat
 * @alias addUsersToConversation
 * @param {number} conversationId - The id of the conversation.
 * @param {Array<number>} userIds - The userIds of the users to add.
 * @returns {Promise<ConversationAddResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.addUsersToConversation(1, [1, 2, 3])
**/

function addUsersToConversation (conversationId, userIds, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/add-to-conversation',
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          conversationId: conversationId,
          participantUserIds: userIds
        },
        resolveWithFullResponse: true
      }
    }
    return http(httpOpt).then((res) => {
      if (res.status === 200) {
        if (!res.data.resultType === 'Success') {
          reject(new Error(res.data.statusMessage))
        } else {
          resolve(res.data)
        }
      } else {
        let error = 'An unknown error has occurred.'
        if (res.data && res.data.errors) {
          error = res.data.errors.map((e) => e.message).join('\n')
        }
        reject(new Error(error))
      }
    }).catch(error => reject(error))
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return addUsersToConversation(args.conversationId, args.userIds, jar, xcsrf)
  })
}

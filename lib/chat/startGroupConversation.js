const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func
const RobloxAPIError = require('../util/apiError.js')

exports.required = ['userIds', 'title']
exports.optional = ['jar']

// Docs
/**
 * 🔐 Start a group conversation.
 * @category Chat
 * @alias startGroupConversation
 * @param {Array<number>} userIds - An array of userIds to add.
 * @param {string} title - The title of the group.
 * @returns {Promise<StartGroupConversationResponse>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.startGroupConversation([1, 2, 3], "A group conversation.")
**/

function startGroupConversation (userIds, chatTitle, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/start-group-conversation',
      options: {
        method: 'POST',
        jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          participantUserIds: userIds,
          title: chatTitle
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
    return startGroupConversation(args.userIds, args.title, jar, xcsrf)
  })
}

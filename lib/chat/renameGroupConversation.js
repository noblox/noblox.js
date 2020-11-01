const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['conversationId', 'title']
exports.optional = ['jar']

// Docs
/**
 * Rename a group conversation.
 * @category Chat
 * @alias renameGroupConversation
 * @param {number} conversationId - The id of the conversation.
 * @param {string} title - The new title of the group.
 * @returns {Promise<void>}
 * @example const noblox = require("noblox.js")
 * //Login using your cookie
 * noblox.renameGroupConversation(1, "A cool group.")
**/

const nextFunction = (jar, token, conversationId, newTitle) => {
  return http({
    url: '//chat.roblox.com/v2/rename-group-conversation',
    options: {
      method: 'POST',
      jar: jar,
      headers: {
        'X-CSRF-TOKEN': token
      },
      json: {
        conversationId: conversationId,
        newTitle: newTitle
      },
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.statusCode === 200) {
      if (!res.body.resultType === 'Success') {
        throw new Error(res.body.statusMessage)
      }
    } else {
      throw new Error('Rename group chat failed')
    }
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return nextFunction(jar, xcsrf, args.conversationId, args.title)
  })
}

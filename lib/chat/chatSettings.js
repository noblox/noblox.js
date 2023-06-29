const http = require('../util/http.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 Get the chat settings.
 * @category Chat
 * @alias chatSettings
 * @returns {Promise<ChatSettings>}
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const settings = await noblox.chatSettings()
**/

exports.func = (args) => {
  const jar = args.jar

  return http({
    url: '//chat.roblox.com/v2/chat-settings',
    options: {
      method: 'GET',
      jar: jar,
      resolveWithFullResponse: true
    }
  }).then((res) => {
    if (res.status !== 200) {
      throw new Error('You are not logged in')
    } else {
      return res.data
    }
  })
}

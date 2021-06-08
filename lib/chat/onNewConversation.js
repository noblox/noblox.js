const events = require('events')

const onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a conversation is created.
 * @category Chat
 * @alias onNewConversation
 * @returns An EventEmitter that emits when a conversation is created.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.onNewConversation().on("data", function(data) {
 *  console.log("New conversation!", data)
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const onChatEvent = new events.EventEmitter()
  const notifications = onNotification({ jar: jar })

  notifications.on('data', (name, message) => {
    if (name === 'ChatNotifications' && message.Type === 'NewConversation') {
      onChatEvent.emit('data', message.ConversationId)
    }
  })

  notifications.on('error', (err) => {
    onChatEvent.emit('error', err)
  })

  notifications.on('connect', () => {
    onChatEvent.emit('connect')
  })

  notifications.on('close', (internal) => {
    if (internal) return
    notifications.emit('close', true)
  })

  return onChatEvent
}

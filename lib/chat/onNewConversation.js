const events = require('events')

const onNotification = require('../client/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a conversation is created.
 * @category Chat
 * @alias onNewConversation
 * @returns An EventEmitter that emits when a conversation is created.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const conversationEvent = noblox.onNewConversation()
 * conversationEvent.on("data", function(data) {
 *  console.log("New conversation! ", data)
 * })
 * conversationEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
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

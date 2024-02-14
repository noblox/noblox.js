const events = require('events')

const onNotification = require('../client/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when someone starts typing in a chat.
 * @category Chat
 * @alias onUserTyping
 * @returns An EventEmitter that emits when someone starts typing in a chat.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const userTyping = noblox.onUserTyping()
 * userTyping.on("data", function(data) {
 *  console.log("User typing! ", data)
 * })
 * userTyping.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({ jar })

  notifications.on('data', (name, message) => {
    if (name === 'ChatNotifications' && message.Type === 'ParticipantTyping') {
      newEvent.emit('data', {
        UserId: message.UserId,
        ConversationId: message.ConversationId,
        IsTyping: message.IsTyping
      })
    }
  })

  notifications.on('error', (err) => {
    newEvent.emit('error', err)
  })

  notifications.on('connect', () => {
    newEvent.emit('connect')
  })

  notifications.on('close', (internal) => {
    if (internal) return
    notifications.emit('close', true)
  })

  return newEvent
}

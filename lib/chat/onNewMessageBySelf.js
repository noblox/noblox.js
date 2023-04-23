const events = require('events')

const onNotification = require('../client/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when you send a new message.
 * @category Chat
 * @alias onNewMessageBySelf
 * @returns An EventEmitter that emits when you send a new message.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const messageSent = noblox.onNewMessageBySelf()
 * messageSent.on("data", function(data) {
 *  console.log("Sent chat message! ", data)
 * })
 * messageSent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({ jar: jar })

  notifications.on('data', (name, message) => {
    if (name === 'ChatNotifications' && message.Type === 'NewMessageBySelf') {
      newEvent.emit('data', message.ConversationId)
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

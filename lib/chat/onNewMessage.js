const events = require('events')

const onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when someone messages you.
 * @category Chat
 * @alias onNewMessage
 * @returns An EventEmitter that emits when someone messages you.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.onNewMessage().on("data", function(data) {
 *  console.log("New message!", data)
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({ jar: jar })

  notifications.on('data', (name, message) => {
    if (name === 'ChatNotifications' && message.Type === 'NewMessage') {
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

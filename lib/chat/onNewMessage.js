const events = require('events')

const onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when someone messages you via. chat. This event will only emit for messages sent via. chat windows on
 * the website - those in the pop-up/overlay window. To handle messages sent via. the older email-like
 * message function, see onMessage.
 * @see [onMessage()](global.html#onMessage)
 * @category Chat
 * @alias onNewMessage
 * @returns An EventEmitter that emits when someone messages you.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const messageEvent = noblox.onNewMessage()
 * messageEvent.on("data", function(data) {
 *  console.log("New chat message! ", data)
 * })
 * messageEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
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

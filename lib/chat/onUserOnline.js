const events = require('events')

const onNotification = require('../user/onNotification.js').func

exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when someone comes online.
 * @category Chat
 * @alias onUserOnline
 * @returns An EventEmitter that emits when someone comes online.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const userOnlineEvent = noblox.onUserOnline()
 * userOnlineEvent.on("data", function(data) {
 *  console.log("User online! ", data)
 * })
 * userOnlineEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

exports.func = (args) => {
  const jar = args.jar
  const newEvent = new events.EventEmitter()
  const notifications = onNotification({ jar: jar })

  notifications.on('data', (name, message) => {
    if (name === 'PresenceNotifications' && message.Type === 'UserOnline') {
      newEvent.emit('data', message.UserId)
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

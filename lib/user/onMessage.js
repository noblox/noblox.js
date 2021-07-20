// Dependencies
const events = require('events')

// Includes
const onNotification = require('./onNotification.js').func
const getMessages = require('./getMessages.js').func

// Args
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a user sends you a message.
 * @category User
 * @alias onMessage
 * @returns An EventEmitter that emits when a user sends you a message.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * noblox.onMessage().on("data", function(data) {
 *  console.log("New message!", data)
 * })
**/

// Define
exports.func = function (args) {
  const jar = args.jar
  const onMessage = new events.EventEmitter()
  let waitingForRequest = false
  let latest
  getMessages({ jar: jar, messageTab: 'Inbox', pageNumber: 0 })
    .then(function (initial) {
      latest = initial.collection[0] ? initial.collection[0].id : 0
      const notifications = onNotification({ jar: jar })
      notifications.on('data', function (name, message) {
        if (name === 'NotificationStream' && message.Type === 'NewNotification') {
          if (waitingForRequest) {
            waitingForRequest = false
          } else {
            getMessages({
              jar: jar,
              messageTab: 'Inbox',
              pageNumber: 0
            })
              .then(function (inbox) {
                const messages = inbox.collection
                for (let i = messages.length - 1; i >= 0; i--) {
                  const message = messages[i]
                  const id = message.id
                  if (id > latest) {
                    latest = id
                    onMessage.emit('data', message)
                  }
                }
              })
          }
        } else if (name === 'FriendshipNotifications' && message.Type === 'FriendshipRequested') {
          waitingForRequest = true
        }
      })
      notifications.on('error', function (err) {
        onMessage.emit('error', err)
      })
      notifications.on('connect', function () {
        onMessage.emit('connect')
      })
      notifications.on('close', function (internal) {
        if (internal) {
          return
        }
        onMessage.emit('close', true)
      })
      onMessage.on('close', function (internal) {
        if (internal) {
          return
        }
        notifications.emit('close', true)
      })
    })

  return onMessage
}

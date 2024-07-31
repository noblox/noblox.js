// Dependencies
const events = require('events')

// Includes
const onNotification = require('../client/onNotification.js').func
const getMessages = require('./getMessages.js').func

// Args
exports.optional = ['jar']

// Docs
/**
 * 🔐 An event for when a user sends you a message via. the older 'email-like' message system. To receive chat messages,
 * see the `onNewMessage` method.
 * @see [onNewMessage()](global.html#onNewMessage).
 * @category User
 * @alias onMessage
 * @returns An EventEmitter that emits when a user sends you a message.
 * @example const noblox = require("noblox.js")
 * // Login using your cookie
 * const messageEvent = noblox.onMessage()
 * messageEvent.on("data", function(data) {
 *  console.log("New message! ", data)
 * })
 * messageEvent.on("error", function(err) {
 *  console.error("Something went wrong: ", err)
 *  // Handle error as needed
 * })
**/

// Define
exports.func = function (args) {
  const jar = args.jar
  const onMessage = new events.EventEmitter()
  let waitingForRequest = false
  let latest
  getMessages({ jar, messageTab: 'Inbox', pageNumber: 0, pageSize: 1 })
    .then(function (initial) {
      latest = initial.collection[0] ? initial.collection[0].id : 0
      const notifications = onNotification({ jar })
      notifications.on('data', function (name, message) {
        if (name === 'MessageNotification' && message.Type === 'Created') {
          if (waitingForRequest) {
            waitingForRequest = false
          } else {
            getMessages({
              jar,
              messageTab: 'Inbox',
              pageNumber: 0,
              pageSize: 1
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

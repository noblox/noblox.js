// Dependencies
var events = require('events')

// Includes
var onNotification = require('./onNotification.js').func
var getMessages = require('./getMessages.js').func

// Args
exports.optional = ['jar']

// Define
exports.func = function (args) {
  var jar = args.jar
  var onMessage = new events.EventEmitter()
  var waitingForRequest = false
  var latest
  getMessages({ jar: jar, messageTab: 'Inbox', pageNumber: 0 })
    .then(function (initial) {
      latest = initial.collection[0] ? initial.collection[0].id : 0
      var notifications = onNotification({ jar: jar })
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
                var messages = inbox.collection
                for (var i = messages.length - 1; i >= 0; i--) {
                  var message = messages[i]
                  var id = message.id
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
